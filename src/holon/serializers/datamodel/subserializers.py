
###################################################
## Note! This script is automatically generated! ##
###################################################

from rest_framework import serializers


from holon.models.actor import (
        NonFirmActor
)


from holon.models.contract import (
        DeliveryContract,
        ConnectionContract,
        TaxContract,
        TransportContract
)


from holon.models.gridconnection import (
        BuiltEnvironmentGridConnection,
        UtilityGridConnection,
        HouseGridConnection,
        BuildingGridConnection,
        ProductionGridConnection,
        IndustryGridConnection,
        DistrictHeatingGridConnection
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
        VehicleElectricStorageAsset
)


from holon.models.gridnode import (
        ElectricGridNode,
        HeatGridNode
)



class NonFirmActorSerializer(serializers.ModelSerializer):

    class Meta:
        model = NonFirmActor
        fields = '__all__'


class DeliveryContractSerializer(serializers.ModelSerializer):

    class Meta:
        model = DeliveryContract
        fields = '__all__'


class ConnectionContractSerializer(serializers.ModelSerializer):

    class Meta:
        model = ConnectionContract
        fields = '__all__'


class TaxContractSerializer(serializers.ModelSerializer):

    class Meta:
        model = TaxContract
        fields = '__all__'


class TransportContractSerializer(serializers.ModelSerializer):

    class Meta:
        model = TransportContract
        fields = '__all__'


class BuiltEnvironmentGridConnectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = BuiltEnvironmentGridConnection
        fields = '__all__'


class UtilityGridConnectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = UtilityGridConnection
        fields = '__all__'


class HouseGridConnectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = HouseGridConnection
        fields = '__all__'


class BuildingGridConnectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = BuildingGridConnection
        fields = '__all__'


class ProductionGridConnectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductionGridConnection
        fields = '__all__'


class IndustryGridConnectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = IndustryGridConnection
        fields = '__all__'


class DistrictHeatingGridConnectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = DistrictHeatingGridConnection
        fields = '__all__'


class ConsumptionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = ConsumptionAsset
        fields = '__all__'


class DieselVehicleAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = DieselVehicleAsset
        fields = '__all__'


class HeatConsumptionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = HeatConsumptionAsset
        fields = '__all__'


class ElectricConsumptionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = ElectricConsumptionAsset
        fields = '__all__'


class HybridConsumptionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = HybridConsumptionAsset
        fields = '__all__'


class ConversionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = ConversionAsset
        fields = '__all__'


class VehicleConversionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = VehicleConversionAsset
        fields = '__all__'


class ElectricCoversionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = ElectricCoversionAsset
        fields = '__all__'


class CookingConversionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = CookingConversionAsset
        fields = '__all__'


class HeatConversionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = HeatConversionAsset
        fields = '__all__'


class ChemicalHeatConversionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = ChemicalHeatConversionAsset
        fields = '__all__'


class ElectricHeatConversionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = ElectricHeatConversionAsset
        fields = '__all__'


class TransportHeatConversionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = TransportHeatConversionAsset
        fields = '__all__'


class HybridHeatCoversionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = HybridHeatCoversionAsset
        fields = '__all__'


class ProductionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductionAsset
        fields = '__all__'


class ElectricProductionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = ElectricProductionAsset
        fields = '__all__'


class HeatProductionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = HeatProductionAsset
        fields = '__all__'


class HybridProductionAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = HybridProductionAsset
        fields = '__all__'


class StorageAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = StorageAsset
        fields = '__all__'


class HeatStorageAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = HeatStorageAsset
        fields = '__all__'


class ElectricStorageAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = ElectricStorageAsset
        fields = '__all__'


class VehicleElectricStorageAssetSerializer(serializers.ModelSerializer):

    class Meta:
        model = VehicleElectricStorageAsset
        fields = '__all__'


class ElectricGridNodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ElectricGridNode
        fields = '__all__'


class HeatGridNodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = HeatGridNode
        fields = '__all__'

