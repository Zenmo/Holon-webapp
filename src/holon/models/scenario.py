from django.db import models, transaction
from django.db.models import QuerySet
from modelcluster.models import ClusterableModel
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from django.utils.translation import gettext_lazy as _

from threading import Thread
from hashlib import sha512


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
