###################################################
## Note! This script is automatically generated! ##
###################################################

from rest_polymorphic.serializers import PolymorphicSerializer


from holon.models.contract import (
    Contract,
    DeliveryContract,
    ConnectionContract,
    TaxContract,
    TransportContract,
)


from holon.models.asset import (
    EnergyAsset,
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


from holon.models.actor import Actor, NonFirmActor


from holon.models.gridconnection import (
    GridConnection,
    BuiltEnvironmentGridConnection,
    UtilityGridConnection,
    HouseGridConnection,
    BuildingGridConnection,
    ProductionGridConnection,
    IndustryGridConnection,
    DistrictHeatingGridConnection,
)


from holon.models.gridnode import GridNode, ElectricGridNode, HeatGridNode


from holon.models.policy import (
    Policy,
)


from .custom import (
    ContractSerializer,
    EnergyAssetSerializer,
    ActorSerializer,
    GridConnectionSerializer,
    GridNodeSerializer,
    PolicySerializer,
)


from .subserializers import (
    DeliveryContractSerializer,
    ConnectionContractSerializer,
    TaxContractSerializer,
    TransportContractSerializer,
)


from .subserializers import (
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


from .subserializers import NonFirmActorSerializer


from .subserializers import (
    BuiltEnvironmentGridConnectionSerializer,
    UtilityGridConnectionSerializer,
    HouseGridConnectionSerializer,
    BuildingGridConnectionSerializer,
    ProductionGridConnectionSerializer,
    IndustryGridConnectionSerializer,
    DistrictHeatingGridConnectionSerializer,
)


from .subserializers import ElectricGridNodeSerializer, HeatGridNodeSerializer


class ContractPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Contract: ContractSerializer,
        DeliveryContract: DeliveryContractSerializer,
        ConnectionContract: ConnectionContractSerializer,
        TaxContract: TaxContractSerializer,
        TransportContract: TransportContractSerializer,
    }


class EnergyAssetPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        EnergyAsset: EnergyAssetSerializer,
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


class ActorPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {Actor: ActorSerializer, NonFirmActor: NonFirmActorSerializer}

    contracts = ContractPolymorphicSerializer(many=True, read_only=True, source="contract_set")


class GridConnectionPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        GridConnection: GridConnectionSerializer,
        BuiltEnvironmentGridConnection: BuiltEnvironmentGridConnectionSerializer,
        UtilityGridConnection: UtilityGridConnectionSerializer,
        HouseGridConnection: HouseGridConnectionSerializer,
        BuildingGridConnection: BuildingGridConnectionSerializer,
        ProductionGridConnection: ProductionGridConnectionSerializer,
        IndustryGridConnection: IndustryGridConnectionSerializer,
        DistrictHeatingGridConnection: DistrictHeatingGridConnectionSerializer,
    }

    assets = EnergyAssetPolymorphicSerializer(many=True, read_only=True, source="asset_set")


class GridNodePolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        GridNode: GridNodeSerializer,
        ElectricGridNode: ElectricGridNodeSerializer,
        HeatGridNode: HeatGridNodeSerializer,
    }

    assets = EnergyAssetPolymorphicSerializer(many=True, read_only=True, source="asset_set")


class PolicyPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Policy: PolicySerializer,
    }


###################################################
## Note! This script is automatically generated! ##
###################################################
