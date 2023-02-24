from django.db import models


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
