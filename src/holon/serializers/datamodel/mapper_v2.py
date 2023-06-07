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
    DieselConsumptionAsset,
    MethaneConsumptionAsset,
    HeatConsumptionAsset,
    ElectricConsumptionAsset,
    HybridConsumptionAsset,
    ConversionAsset,
    VehicleConversionAsset,
    ElectricCoversionAsset,
    CookingConversionAsset,
    HeatConversionAsset,
    ChemicalHeatConversionAsset,
    BiogasMethaneConverter,
    ElectricHeatConversionAsset,
    TransportHeatConversionAsset,
    HybridHeatCoversionAsset,
    ProductionAsset,
    ElectricProductionAsset,
    HeatProductionAsset,
    HybridProductionAsset,
    LiveStock,
    StorageAsset,
    HeatStorageAsset,
    ElectricStorageAsset,
    GasStorageAsset,
    VehicleElectricStorageAsset,
)


from holon.models.actor import Actor, ActorGroup, ActorSubGroup


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
    ContractV2Serializer,
    EnergyAssetSerializer,
    ActorV2Serializer,
    GridConnectionV2Serializer,
    GridNodeV2Serializer,
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
    DieselConsumptionAssetSerializer,
    MethaneConsumptionAssetSerializer,
    HeatConsumptionAssetSerializer,
    ElectricConsumptionAssetSerializer,
    HybridConsumptionAssetSerializer,
    ConversionAssetSerializer,
    VehicleConversionAssetSerializer,
    ElectricCoversionAssetSerializer,
    CookingConversionAssetSerializer,
    HeatConversionAssetSerializer,
    ChemicalHeatConversionAssetSerializer,
    BiogasMethaneConverterSerializer,
    ElectricHeatConversionAssetSerializer,
    TransportHeatConversionAssetSerializer,
    HybridHeatCoversionAssetSerializer,
    ProductionAssetSerializer,
    ElectricProductionAssetSerializer,
    HeatProductionAssetSerializer,
    HybridProductionAssetSerializer,
    LiveStockSerializer,
    StorageAssetSerializer,
    HeatStorageAssetSerializer,
    ElectricStorageAssetSerializer,
    GasStorageAssetSerializer,
    VehicleElectricStorageAssetSerializer,
)


from .subserializers import ActorGroupSerializer, ActorSubGroupSerializer


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


class ContractV2PolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Contract: ContractV2Serializer,
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
        DieselConsumptionAsset: DieselConsumptionAssetSerializer,
        MethaneConsumptionAsset: MethaneConsumptionAssetSerializer,
        HeatConsumptionAsset: HeatConsumptionAssetSerializer,
        ElectricConsumptionAsset: ElectricConsumptionAssetSerializer,
        HybridConsumptionAsset: HybridConsumptionAssetSerializer,
        ConversionAsset: ConversionAssetSerializer,
        VehicleConversionAsset: VehicleConversionAssetSerializer,
        ElectricCoversionAsset: ElectricCoversionAssetSerializer,
        CookingConversionAsset: CookingConversionAssetSerializer,
        HeatConversionAsset: HeatConversionAssetSerializer,
        ChemicalHeatConversionAsset: ChemicalHeatConversionAssetSerializer,
        BiogasMethaneConverter: BiogasMethaneConverterSerializer,
        ElectricHeatConversionAsset: ElectricHeatConversionAssetSerializer,
        TransportHeatConversionAsset: TransportHeatConversionAssetSerializer,
        HybridHeatCoversionAsset: HybridHeatCoversionAssetSerializer,
        ProductionAsset: ProductionAssetSerializer,
        ElectricProductionAsset: ElectricProductionAssetSerializer,
        HeatProductionAsset: HeatProductionAssetSerializer,
        HybridProductionAsset: HybridProductionAssetSerializer,
        LiveStock: LiveStockSerializer,
        StorageAsset: StorageAssetSerializer,
        HeatStorageAsset: HeatStorageAssetSerializer,
        ElectricStorageAsset: ElectricStorageAssetSerializer,
        GasStorageAsset: GasStorageAssetSerializer,
        VehicleElectricStorageAsset: VehicleElectricStorageAssetSerializer,
    }


class ActorV2PolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Actor: ActorV2Serializer,
        ActorGroup: ActorGroupSerializer,
        ActorSubGroup: ActorSubGroupSerializer,
    }


class GridConnectionV2PolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        GridConnection: GridConnectionV2Serializer,
        BuiltEnvironmentGridConnection: BuiltEnvironmentGridConnectionSerializer,
        UtilityGridConnection: UtilityGridConnectionSerializer,
        HouseGridConnection: HouseGridConnectionSerializer,
        BuildingGridConnection: BuildingGridConnectionSerializer,
        ProductionGridConnection: ProductionGridConnectionSerializer,
        IndustryGridConnection: IndustryGridConnectionSerializer,
        DistrictHeatingGridConnection: DistrictHeatingGridConnectionSerializer,
    }


class GridNodeV2PolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        GridNode: GridNodeV2Serializer,
        ElectricGridNode: ElectricGridNodeSerializer,
        HeatGridNode: HeatGridNodeSerializer,
    }


class PolicyPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Policy: PolicySerializer,
    }


###################################################
## Note! This script is automatically generated! ##
###################################################
