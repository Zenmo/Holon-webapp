from django.db import models, transaction

from holon.models.util import duplicate_model


class Scenario(models.Model):
    name = models.CharField(max_length=255)
    etm_scenario_id = models.IntegerField()
    _assets = None

    class Meta:
        verbose_name = "Scenario"

    def __str__(self):
        return self.name

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
        from holon.models import Actor, EnergyAsset, GridConnection, GridNode, Policy

        old_scenario_id = self.id

        with transaction.atomic():
            new_scenario = duplicate_model(self)

            actors = Actor.objects.filter(payload_id=old_scenario_id)
            actor_id_to_new_model_mapping = {}

            for actor in actors:
                actor_id = actor.id
                new_actor = duplicate_model(actor, {"payload": new_scenario})

                actor_id_to_new_model_mapping[actor_id] = new_actor

            # Update parent_actor field to newly updated actor model
            updated_actors = Actor.objects.filter(
                payload_id=new_scenario.id, parent_actor__isnull=False
            )

            for updated_actor in updated_actors:
                updated_actor.parent_actor = actor_id_to_new_model_mapping[
                    updated_actor.parent_actor.id
                ]
                updated_actor.save()

            gridconnections = GridConnection.objects.filter(payload_id=old_scenario_id)
            for gridconnection in gridconnections:
                gridconnection_id = gridconnection.pk
                new_gridconnection = duplicate_model(
                    gridconnection,
                    {
                        "payload": new_scenario,
                        "owner_actor": actor_id_to_new_model_mapping[gridconnection.owner_actor_id],
                    },
                )

                assets = EnergyAsset.objects.filter(gridconnection_id=gridconnection_id)
                for asset in assets:
                    duplicate_model(asset, {"gridconnection": new_gridconnection})

            gridnodes = GridNode.objects.filter(payload_id=old_scenario_id)
            for gridnode in gridnodes:
                duplicate_model(gridnode, {"payload": new_scenario})

            policies = Policy.objects.filter(payload_id=old_scenario_id)
            for policy in policies:
                duplicate_model(policy, {"payload": new_scenario})

            return new_scenario
