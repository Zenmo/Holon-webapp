from django.db import models, transaction
from django.db.models import QuerySet
from modelcluster.models import ClusterableModel
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from django.utils.translation import gettext_lazy as _

from holon.models.util import duplicate_model_nomutate
from threading import Thread
from hashlib import sha512

from pipit.sentry import sentry_sdk_trace


class Scenario(ClusterableModel):
    name = models.CharField(max_length=255)
    version = models.IntegerField(default=1)
    comment = models.TextField(blank=True)

    cloned_from = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True)

    panels = [
        FieldPanel("name"),
        FieldPanel(
            "version",
            help_text=_(
                "Symbolic, allows for multiple versions of the scenario to live (synchronise this with the AnyLogic version)"
            ),
        ),
        FieldPanel(
            "comment",
            help_text=_(
                "Use this field to describe the content of this version such that you can use the version in version control"
            ),
        ),
        InlinePanel(
            "anylogic_config",
            heading="Anylogic cloudclient configuration",
            label="Anylogic cloudclient configuration",
            max_num=1,
            min_num=1,
        ),
        InlinePanel(
            "query_and_convert_config",
            heading="ETM module configuration",
            label="ETM module configuration",
            max_num=4,
            min_num=4,
        ),
    ]

    class Meta:
        verbose_name = "Scenario"

    def __str__(self):
        return f"{self.name} - versie {self.version}"

    @property
    def assets(self) -> "list[EnergyAsset]":
        from holon.models.asset import EnergyAsset

        assets = EnergyAsset.objects.none()
        for gridconnection in self.gridconnection_set.all():
            assets = assets | gridconnection.energyasset_set.all()
        for gridnode in self.gridnode_set.all():
            assets = assets | gridnode.energyasset_set.all()

        return assets

    @property
    def contracts(self) -> "list[Contract]":
        from holon.models import Contract

        contracts = Contract.objects.none()
        for actor in self.actor_set.all():
            contracts = contracts | actor.contracts.all()

        return contracts

    @classmethod
    def queryset_with_relations(cls) -> QuerySet:
        """Queryset to load scenario with the relations it has ownership ver"""

        return (
            cls.objects.prefetch_related("actor_set")
            .prefetch_related("actor_set__contracts")
            .prefetch_related("gridconnection_set")
            .prefetch_related("gridconnection_set__energyasset_set")
            .prefetch_related("gridnode_set")
            .prefetch_related("gridnode_set__energyasset_set")
            .prefetch_related("policy_set")
        )

    @sentry_sdk_trace
    def clone(self) -> "Scenario":
        """Clone scenario and all its relations in a new scenario"""

        from holon.models import EnergyAsset, GridNode, Contract, Actor, Policy

        with transaction.atomic():
            new_scenario = duplicate_model_nomutate(self)
            new_scenario.cloned_from = self
            new_scenario.save()

            actor_id_to_new_model_mapping = {}

            for actor in self.actor_set.all():
                new_actor = duplicate_model_nomutate(actor)
                new_actor.payload = new_scenario
                new_actor.original_id = actor.id

                actor_id_to_new_model_mapping[actor.id] = new_actor

            Actor.objects.bulk_create(actor_id_to_new_model_mapping.values())

            for contract in Contract.objects.filter(actor__payload_id=self.id):
                new_contract = duplicate_model_nomutate(contract)
                new_contract.original_id = contract.id
                new_contract.actor = actor_id_to_new_model_mapping[contract.actor_id]
                new_contract.contractScope = actor_id_to_new_model_mapping[
                    contract.contractScope_id
                ]
                # Can't bulk create because it's not implemented in django-polymorphic
                new_contract.save()

            gridnode_id_to_new_model_mapping = {}
            for gridnode in self.gridnode_set.all():
                new_gridnode = duplicate_model_nomutate(gridnode)
                new_gridnode.original_id = gridnode.id
                new_gridnode.payload = new_scenario
                new_gridnode.owner_actor = actor_id_to_new_model_mapping[gridnode.owner_actor_id]
                # Can't bulk create because it's not implemented in django-polymorphic
                new_gridnode.save()

                gridnode_id_to_new_model_mapping[gridnode.id] = new_gridnode

            for gridnode in self.gridnode_set.all():
                for asset in gridnode.energyasset_set.all():
                    new_asset = duplicate_model_nomutate(asset)
                    new_asset.original_id = asset.id
                    new_asset.gridnode = gridnode_id_to_new_model_mapping[asset.gridnode_id]
                    # Can't bulk create because it's not implemented in django-polymorphic
                    new_asset.save()

            # Update gridnode parent
            for gridnode in gridnode_id_to_new_model_mapping.values():
                if gridnode.parent:
                    gridnode.parent = gridnode_id_to_new_model_mapping[gridnode.parent.id]
                    gridnode.save()

            gridconnections = self.gridconnection_set.all()

            for gridconnection in gridconnections:
                new_gridconnection = duplicate_model_nomutate(gridconnection)
                new_gridconnection.original_id = gridconnection.pk
                new_gridconnection.payload = new_scenario
                new_gridconnection.owner_actor = actor_id_to_new_model_mapping[
                    gridconnection.owner_actor_id
                ]

                if gridconnection.parent_heat_id:
                    new_gridconnection.parent_heat = gridnode_id_to_new_model_mapping[
                        gridconnection.parent_heat_id
                    ]
                if gridconnection.parent_electric_id:
                    new_gridconnection.parent_electric = gridnode_id_to_new_model_mapping[
                        gridconnection.parent_electric_id
                    ]

                # Can't bulk create because it's not implemented in django-polymorphic
                new_gridconnection.save()

                for asset in gridconnection.energyasset_set.all():
                    new_asset = duplicate_model_nomutate(asset)
                    new_asset.original_id = asset.id
                    new_asset.gridconnection = new_gridconnection
                    # Can't bulk create because it's not implemented in django-polymorphic
                    new_asset.save()

            new_policies = []
            for policy in self.policy_set.all():
                new_policy = duplicate_model_nomutate(policy)
                new_policy.original_id = policy.id
                new_policy.payload = new_scenario

                new_policies.append(new_policy)

            Policy.objects.bulk_create(new_policies)

            # fetch again to make sure nothing stale is left in the object
            return Scenario.objects.get(id=new_scenario.id)

    def delete(self) -> None:
        """Delete scenario and all its relations"""

        def delete_individualy(queryset):
            for object in queryset:
                object.delete()

        with transaction.atomic():
            # Delete polymorphic models individually
            # django-polymorphic can't handle deletion of mixed object types
            from holon.models import Contract

            delete_individualy(self.assets)
            delete_individualy(self.gridconnection_set.all())
            delete_individualy(self.gridnode_set.all())
            delete_individualy(Contract.objects.filter(actor__payload_id=self.id))
            delete_individualy(self.actor_set.all())

            return super().delete()

    def delete_async(self) -> None:
        """Delete the scenario asynchrou"""
        t = Thread(target=self.delete)
        t.start()

    def hash(self):
        interactive_element_hashes = ",".join(
            [
                interactive_element.hash()
                for interactive_element in self.interactiveelement_set.all()
            ]
        )
        # print("Interactive elements configuration hash:", interactive_element_hashes)
        cms_configuration_hash = sha512(interactive_element_hashes.encode("utf-8")).hexdigest()

        return f"{self.id}_{cms_configuration_hash}"
