###################################################
## Note! This script is automatically generated! ##
###################################################

from rest_polymorphic.serializers import PolymorphicSerializer


from holon.models.actor import NonFirmActor


from holon.models.contract import (
    DeliveryContract,
    ConnectionContract,
    TaxContract,
    TransportContract,
)


from holon.models.gridconnection import (
    BuiltEnvironmentGridConnection,
    UtilityGridConnection,
    HouseGridConnection,
    BuildingGridConnection,
    ProductionGridConnection,
    IndustryGridConnection,
    DistrictHeatingGridConnection,
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


from holon.models.gridnode import ElectricGridNode, HeatGridNode


from .datamodel_subseries import NonFirmActorSerializer


from .datamodel_subseries import (
    DeliveryContractSerializer,
    ConnectionContractSerializer,
    TaxContractSerializer,
    TransportContractSerializer,
)


from .datamodel_subseries import (
    BuiltEnvironmentGridConnectionSerializer,
    UtilityGridConnectionSerializer,
    HouseGridConnectionSerializer,
    BuildingGridConnectionSerializer,
    ProductionGridConnectionSerializer,
    IndustryGridConnectionSerializer,
    DistrictHeatingGridConnectionSerializer,
)


from .datamodel_subseries import (
    ConsumptionAssetSerializer,
    DieselVehicleAssetSerializer,
    HeatConsumptionAssetSerializer,
    ElectricConsumptionAssetSerializer,
    HybridConsumptionAssetSerializer,
    ConversionAssetSerializer,
    VehicleConversionAssetSerializer,
    ElectricCoversionAssetSerializer,
    CookingConversionAssetSerializer,
    HeatConversionAssetSerializer,
    ChemicalHeatConversionAssetSerializer,
    ElectricHeatConversionAssetSerializer,
    TransportHeatConversionAssetSerializer,
    HybridHeatCoversionAssetSerializer,
    ProductionAssetSerializer,
    ElectricProductionAssetSerializer,
    HeatProductionAssetSerializer,
    HybridProductionAssetSerializer,
    StorageAssetSerializer,
    HeatStorageAssetSerializer,
    ElectricStorageAssetSerializer,
    VehicleElectricStorageAssetSerializer,
)


from .datamodel_subseries import ElectricGridNodeSerializer, HeatGridNodeSerializer


class ActorPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {NonFirmActor: NonFirmActorSerializer}


class ContractPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        DeliveryContract: DeliveryContractSerializer,
        ConnectionContract: ConnectionContractSerializer,
        TaxContract: TaxContractSerializer,
        TransportContract: TransportContractSerializer,
    }


class GridConnectionPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        BuiltEnvironmentGridConnection: BuiltEnvironmentGridConnectionSerializer,
        UtilityGridConnection: UtilityGridConnectionSerializer,
        HouseGridConnection: HouseGridConnectionSerializer,
        BuildingGridConnection: BuildingGridConnectionSerializer,
        ProductionGridConnection: ProductionGridConnectionSerializer,
        IndustryGridConnection: IndustryGridConnectionSerializer,
        DistrictHeatingGridConnection: DistrictHeatingGridConnectionSerializer,
    }


class EnergyAssetPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        ConsumptionAsset: ConsumptionAssetSerializer,
        DieselVehicleAsset: DieselVehicleAssetSerializer,
        HeatConsumptionAsset: HeatConsumptionAssetSerializer,
        ElectricConsumptionAsset: ElectricConsumptionAssetSerializer,
        HybridConsumptionAsset: HybridConsumptionAssetSerializer,
        ConversionAsset: ConversionAssetSerializer,
        VehicleConversionAsset: VehicleConversionAssetSerializer,
        ElectricCoversionAsset: ElectricCoversionAssetSerializer,
        CookingConversionAsset: CookingConversionAssetSerializer,
        HeatConversionAsset: HeatConversionAssetSerializer,
        ChemicalHeatConversionAsset: ChemicalHeatConversionAssetSerializer,
        ElectricHeatConversionAsset: ElectricHeatConversionAssetSerializer,
        TransportHeatConversionAsset: TransportHeatConversionAssetSerializer,
        HybridHeatCoversionAsset: HybridHeatCoversionAssetSerializer,
        ProductionAsset: ProductionAssetSerializer,
        ElectricProductionAsset: ElectricProductionAssetSerializer,
        HeatProductionAsset: HeatProductionAssetSerializer,
        HybridProductionAsset: HybridProductionAssetSerializer,
        StorageAsset: StorageAssetSerializer,
        HeatStorageAsset: HeatStorageAssetSerializer,
        ElectricStorageAsset: ElectricStorageAssetSerializer,
        VehicleElectricStorageAsset: VehicleElectricStorageAssetSerializer,
    }


class GridNodePolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        ElectricGridNode: ElectricGridNodeSerializer,
        HeatGridNode: HeatGridNodeSerializer,
    }
