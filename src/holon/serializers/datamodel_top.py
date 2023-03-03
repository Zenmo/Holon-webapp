
###################################################
## Note! This script is automatically generated! ##
###################################################

from rest_polymorphic.serializers import PolymorphicSerializer


from datamodel_subseries import (
        NonFirmActor
)


from datamodel_subseries import (
        DeliveryContract,
        ConnectionContract,
        TaxContract,
        TransportContract
)


from datamodel_subseries import (
        BuiltEnvironmentGridConnection,
        UtilityGridConnection,
        HouseGridConnection,
        BuildingGridConnection,
        ProductionGridConnection,
        IndustryGridConnection,
        DistrictHeatingGridConnection
)


from datamodel_subseries import (
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
        VehicleElectricStorageAsset
)


from datamodel_subseries import (
        ElectricGridNode,
        HeatGridNode
)



class ActorPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        NonFirmActor: NonFirmActorSerializer
    }

class ContractPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        DeliveryContract: DeliveryContractSerializer,
        ConnectionContract: ConnectionContractSerializer,
        TaxContract: TaxContractSerializer,
        TransportContract: TransportContractSerializer
    }

class GridConnectionPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        BuiltEnvironmentGridConnection: BuiltEnvironmentGridConnectionSerializer,
        UtilityGridConnection: UtilityGridConnectionSerializer,
        HouseGridConnection: HouseGridConnectionSerializer,
        BuildingGridConnection: BuildingGridConnectionSerializer,
        ProductionGridConnection: ProductionGridConnectionSerializer,
        IndustryGridConnection: IndustryGridConnectionSerializer,
        DistrictHeatingGridConnection: DistrictHeatingGridConnectionSerializer
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
        VehicleElectricStorageAsset: VehicleElectricStorageAssetSerializer
    }

class GridNodePolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        ElectricGridNode: ElectricGridNodeSerializer,
        HeatGridNode: HeatGridNodeSerializer
    }
