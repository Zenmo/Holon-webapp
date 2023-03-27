from django.db import models, transaction
from modelcluster.models import ClusterableModel
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from django.utils.translation import gettext_lazy as _

from holon.models.util import bulk_duplicate, duplicate_model
from threading import Thread


class Scenario(ClusterableModel):
    name = models.CharField(max_length=255)
    version = models.IntegerField(default=1)
    comment = models.TextField(blank=True)

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

    _assets = None

    class Meta:
        verbose_name = "Scenario"

    def __str__(self):
        return f"{self.name} - versie {self.version}"

    @property
    def assets(self) -> "list[EnergyAsset]":
        if not self._assets:
            self._assets = self.__load_assets()

        return self._assets

    def __load_assets(self) -> "list[EnergyAsset]":
        from holon.models.asset import EnergyAsset

        assets = EnergyAsset.objects.none()
        for gridconnection in self.gridconnection_set.all():
            assets = assets | gridconnection.energyasset_set.all()

        return assets

    def clone(self) -> "Scenario":
        """Clone scenario and all its relations in a new scenario"""

        from holon.models import Actor, EnergyAsset, GridConnection, GridNode, Policy, Contract

        old_scenario_id = self.id

        scenario_old = (
            Scenario.objects.prefetch_related("actor_set")
            .prefetch_related("actor_set__contracts")
            .prefetch_related("gridconnection_set")
            .prefetch_related("gridconnection_set__energyasset_set")
            .prefetch_related("gridnode_set")
            .prefetch_related("gridnode_set__energyasset_set")
            .prefetch_related("policy_set")
            .get(id=self.id)
        )

        with transaction.atomic():
            # DUPLICATE SCENARIO
            scenario_new = duplicate_model(self)

            # DUPLICATE ACTORS
            actors = scenario_old.actor_set.all()
            actor_old_ids = [actor.id for actor in actors]
            actors = bulk_duplicate(actors, {"payload": scenario_new})

            actor_id_to_new_model_mapping = {}
            for actor_new, actor_old_id in zip(actors, actor_old_ids):
                actor_id_to_new_model_mapping[actor_old_id] = actor_new

            # DUPLICATE CONTRACTS
            contracts = Contract.objects.none()
            attributes = []

            for actor_new in actors:
                contracts |= actor_new.contracts.all()
                attributes += [
                    {
                        "actor": actor_id_to_new_model_mapping[contract.actor.id],
                        "contractScope": actor_id_to_new_model_mapping[contract.contractScope.id],
                    }
                    for contract in contracts
                ]

            bulk_duplicate(contracts, attributes)

            # DUPLICATE GRIDNODES
            gridnodes = scenario_old.gridnode_set.all()
            gridnode_old_ids = [gridnode.id for gridnode in gridnodes]

            attributes = [
                {
                    "payload": scenario_new,
                    "owner_actor": actor_id_to_new_model_mapping[gridnode.owner_actor_id],
                }
                for gridnode in gridnodes
            ]

            gridnodes = bulk_duplicate(gridnodes, attributes)

            gridnode_id_to_new_model_mapping = {}
            for gridnode_old_id, gridnode_new in zip(gridnode_old_ids, gridnodes):
                gridnode_id_to_new_model_mapping[gridnode_old_id] = gridnode_new

            # Update gridnode parent # TODO stroom line
            # gridnodes = scenario_new.gridnode_set.all()
            # gridnodes = GridNode.objects.filter(payload_id=scenario_new.id)
            for gridnode, gridnode_old_id in zip(gridnodes, gridnode_old_ids):
                if gridnode.parent:
                    gridnode.parent = gridnode_id_to_new_model_mapping[gridnode.parent.id]
                    gridnode_new = gridnode.save()
                    gridnode_id_to_new_model_mapping[gridnode_old_id] = gridnode_new

            # DUPLICATE GRIDCONNECTIONS
            gridconnections = scenario_old.gridconnection_set.all()

            # get gridconnection ids and assets (for later)
            gridconnection_asset_lists = [
                gridconnection.energyasset_set.all() for gridconnection in gridconnections
            ]

            # set up attributes for new gridconnections
            attributes = [
                {
                    "payload": scenario_new,
                    "owner_actor": actor_id_to_new_model_mapping[gridconnection.owner_actor_id],
                    "parent_heat": gridnode_id_to_new_model_mapping.get(
                        gridconnection.parent_heat_id, None
                    ),
                    "parent_electric": gridnode_id_to_new_model_mapping.get(
                        gridconnection.parent_electric_id, None
                    ),
                }
                for gridconnection in gridconnections
            ]

            gridconnections = bulk_duplicate(gridconnections, attributes)

            # DUPLICATE ASSETS
            assets = EnergyAsset.objects.none()
            attributes = []

            for gridconnection_new, gridconnections_assets in zip(
                gridconnections, gridconnection_asset_lists
            ):
                assets |= gridconnections_assets
                attributes += [{"gridconnection": gridconnection_new}]

            bulk_duplicate(assets, attributes)

            # DUPLICATE POLICIES
            policies = scenario_old.policy_set.all()
            bulk_duplicate(policies, {"payload": scenario_new})

            return scenario_new

    def clone_old(self) -> "Scenario":
        """Clone scenario and all its relations in a new scenario"""

        from holon.models import Actor, EnergyAsset, GridConnection, GridNode, Policy, Contract

        old_scenario_id = self.id

        with transaction.atomic():
            new_scenario = duplicate_model(self)

            actors = Actor.objects.filter(payload_id=old_scenario_id)
            actor_id_to_new_model_mapping = {}

            for actor in actors:
                actor_id = actor.id
                new_actor = duplicate_model(actor, {"payload": new_scenario})

                actor_id_to_new_model_mapping[actor_id] = new_actor

            contracts = Contract.objects.filter(actor__payload_id=old_scenario_id)
            for contr in contracts:
                duplicate_model(
                    contr,
                    {
                        "actor": actor_id_to_new_model_mapping[contr.actor.id],
                        "contractScope": actor_id_to_new_model_mapping[contr.contractScope.id],
                    },
                )

            gridnodes = GridNode.objects.filter(payload_id=old_scenario_id)
            gridnode_id_to_new_model_mapping = {}
            for gridnode in gridnodes:
                gridnode_id = gridnode.id
                new_gridnode = duplicate_model(
                    gridnode,
                    {
                        "payload": new_scenario,
                        "owner_actor": actor_id_to_new_model_mapping[gridnode.owner_actor_id],
                    },
                )

                gridnode_id_to_new_model_mapping[gridnode_id] = new_gridnode

            # Update gridnode parent
            new_gridnodes = GridNode.objects.filter(payload_id=new_scenario.id)
            for gridnode in new_gridnodes:
                if gridnode.parent:
                    gridnode.parent = gridnode_id_to_new_model_mapping[gridnode.parent.id]
                    gridnode.save()

            gridconnections = GridConnection.objects.filter(payload_id=old_scenario_id)
            for gridconnection in gridconnections:
                attributes_to_update = {
                    "payload": new_scenario,
                    "owner_actor": actor_id_to_new_model_mapping[gridconnection.owner_actor_id],
                }
                if gridconnection.parent_heat:
                    attributes_to_update["parent_heat"] = gridnode_id_to_new_model_mapping[
                        gridconnection.parent_heat.id
                    ]
                if gridconnection.parent_electric:
                    attributes_to_update["parent_electric"] = gridnode_id_to_new_model_mapping[
                        gridconnection.parent_electric.id
                    ]

                gridconnection_id = gridconnection.pk
                new_gridconnection = duplicate_model(gridconnection, attributes_to_update)

                assets = EnergyAsset.objects.filter(gridconnection_id=gridconnection_id)
                for asset in assets:
                    duplicate_model(asset, {"gridconnection": new_gridconnection})

            policies = Policy.objects.filter(payload_id=old_scenario_id)
            for policy in policies:
                duplicate_model(policy, {"payload": new_scenario})

            return new_scenario

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
