###################################################
## Note! This script is automatically generated! ##
###################################################

from rest_framework import serializers

from .custom import (
    ContractSerializer,
    EnergyAssetSerializer,
    ActorSerializer,
    GridConnectionSerializer,
    GridNodeSerializer,
    PolicySerializer,
)


from holon.models.contract import (
    DeliveryContract,
    ConnectionContract,
    TaxContract,
    TransportContract,
)


from holon.models.asset import (
    ConsumptionAsset,
    DieselVehicleAsset,
    HeatConsumptionAsset,
    ElectricConsumptionAsset,
    HybridConsumptionAsset,
    ConversionAsset,
    VehicleConversionAsset,
    ElectricCoversionAsset,
    CookingConversionAsset,
    HeatConversionAsset,
    ChemicalHeatConversionAsset,
    ElectricHeatConversionAsset,
    TransportHeatConversionAsset,
    HybridHeatCoversionAsset,
    ProductionAsset,
    ElectricProductionAsset,
    HeatProductionAsset,
    HybridProductionAsset,
    StorageAsset,
    HeatStorageAsset,
    ElectricStorageAsset,
    VehicleElectricStorageAsset,
)


from holon.models.actor import NonFirmActor


from holon.models.gridconnection import (
    BuiltEnvironmentGridConnection,
    UtilityGridConnection,
    HouseGridConnection,
    BuildingGridConnection,
    ProductionGridConnection,
    IndustryGridConnection,
    DistrictHeatingGridConnection,
)


from holon.models.gridnode import ElectricGridNode, HeatGridNode


class DeliveryContractSerializer(ContractSerializer):
    class Meta:
        model = DeliveryContract
        fields = "__all__"


class ConnectionContractSerializer(ContractSerializer):
    class Meta:
        model = ConnectionContract
        fields = "__all__"


class TaxContractSerializer(ContractSerializer):
    class Meta:
        model = TaxContract
        fields = "__all__"


class TransportContractSerializer(ContractSerializer):
    class Meta:
        model = TransportContract
        fields = "__all__"


class ConsumptionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = ConsumptionAsset
        fields = "__all__"


class DieselVehicleAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = DieselVehicleAsset
        fields = "__all__"


class HeatConsumptionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = HeatConsumptionAsset
        fields = "__all__"


class ElectricConsumptionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = ElectricConsumptionAsset
        fields = "__all__"


class HybridConsumptionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = HybridConsumptionAsset
        fields = "__all__"


class ConversionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = ConversionAsset
        fields = "__all__"


class VehicleConversionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = VehicleConversionAsset
        fields = "__all__"


class ElectricCoversionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = ElectricCoversionAsset
        fields = "__all__"


class CookingConversionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = CookingConversionAsset
        fields = "__all__"


class HeatConversionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = HeatConversionAsset
        fields = "__all__"


class ChemicalHeatConversionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = ChemicalHeatConversionAsset
        fields = "__all__"


class ElectricHeatConversionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = ElectricHeatConversionAsset
        fields = "__all__"


class TransportHeatConversionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = TransportHeatConversionAsset
        fields = "__all__"


class HybridHeatCoversionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = HybridHeatCoversionAsset
        fields = "__all__"


class ProductionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = ProductionAsset
        fields = "__all__"


class ElectricProductionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = ElectricProductionAsset
        fields = "__all__"


class HeatProductionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = HeatProductionAsset
        fields = "__all__"


class HybridProductionAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = HybridProductionAsset
        fields = "__all__"


class StorageAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = StorageAsset
        fields = "__all__"


class HeatStorageAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = HeatStorageAsset
        fields = "__all__"


class ElectricStorageAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = ElectricStorageAsset
        fields = "__all__"


class VehicleElectricStorageAssetSerializer(EnergyAssetSerializer):
    class Meta:
        model = VehicleElectricStorageAsset
        fields = "__all__"


class NonFirmActorSerializer(ActorSerializer):
    class Meta:
        model = NonFirmActor
        fields = "__all__"


class BuiltEnvironmentGridConnectionSerializer(GridConnectionSerializer):
    class Meta:
        model = BuiltEnvironmentGridConnection
        fields = "__all__"


class UtilityGridConnectionSerializer(GridConnectionSerializer):
    class Meta:
        model = UtilityGridConnection
        fields = "__all__"


class HouseGridConnectionSerializer(GridConnectionSerializer):
    class Meta:
        model = HouseGridConnection
        fields = "__all__"


class BuildingGridConnectionSerializer(GridConnectionSerializer):
    class Meta:
        model = BuildingGridConnection
        fields = "__all__"


class ProductionGridConnectionSerializer(GridConnectionSerializer):
    class Meta:
        model = ProductionGridConnection
        fields = "__all__"


class IndustryGridConnectionSerializer(GridConnectionSerializer):
    class Meta:
        model = IndustryGridConnection
        fields = "__all__"


class DistrictHeatingGridConnectionSerializer(GridConnectionSerializer):
    class Meta:
        model = DistrictHeatingGridConnection
        fields = "__all__"


class ElectricGridNodeSerializer(GridNodeSerializer):
    class Meta:
        model = ElectricGridNode
        fields = "__all__"


class HeatGridNodeSerializer(GridNodeSerializer):
    class Meta:
        model = HeatGridNode
        fields = "__all__"


###################################################
## Note! This script is automatically generated! ##
###################################################
