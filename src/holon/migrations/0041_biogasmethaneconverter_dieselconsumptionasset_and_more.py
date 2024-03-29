# Generated by Django 4.1.9 on 2023-06-02 14:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("holon", "0040_alter_queryandconvertconfig_generic_etm_query"),
    ]

    operations = [
        migrations.CreateModel(
            name="BiogasMethaneConverter",
            fields=[
                (
                    "conversionasset_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="holon.conversionasset",
                    ),
                ),
                ("capacityMethane_kW", models.FloatField()),
            ],
            options={
                "abstract": False,
                "base_manager_name": "objects",
            },
            bases=("holon.conversionasset",),
        ),
        migrations.CreateModel(
            name="DieselConsumptionAsset",
            fields=[
                (
                    "consumptionasset_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="holon.consumptionasset",
                    ),
                ),
                ("yearlyDemandDiesel_kWh", models.FloatField()),
            ],
            options={
                "abstract": False,
                "base_manager_name": "objects",
            },
            bases=("holon.consumptionasset",),
        ),
        migrations.CreateModel(
            name="GasStorageAsset",
            fields=[
                (
                    "storageasset_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="holon.storageasset",
                    ),
                ),
                ("capacityGas_kW", models.FloatField()),
                ("storageCapacity_kWh", models.FloatField()),
                ("stateOfCharge_r", models.FloatField()),
            ],
            options={
                "abstract": False,
                "base_manager_name": "objects",
            },
            bases=("holon.storageasset",),
        ),
        migrations.CreateModel(
            name="LiveStock",
            fields=[
                (
                    "productionasset_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="holon.productionasset",
                    ),
                ),
                ("yearlyProductionMethane_kWh", models.FloatField(default=0.0)),
            ],
            options={
                "abstract": False,
                "base_manager_name": "objects",
            },
            bases=("holon.productionasset",),
        ),
        migrations.CreateModel(
            name="MethaneConsumptionAsset",
            fields=[
                (
                    "consumptionasset_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="holon.consumptionasset",
                    ),
                ),
                ("yearlyDemandMethane_kWh", models.FloatField()),
            ],
            options={
                "abstract": False,
                "base_manager_name": "objects",
            },
            bases=("holon.consumptionasset",),
        ),
        migrations.AlterField(
            model_name="consumptionasset",
            name="type",
            field=models.CharField(
                choices=[
                    ("ELECTRICITY_DEMAND", "Electricity Demand"),
                    ("HEAT_DEMAND", "Heat Demand"),
                    ("HOT_WATER_CONSUMPTION", "Hot Water Consumption"),
                    ("OTHER_ELECTRICITY_CONSUMPTION", "Other Electricity Consumption"),
                    ("DIESEL_VEHICLE", "Diesel Vehicle"),
                    ("DIESEL_DEMAND", "Diesel Demand"),
                    ("METHANE_DEMAND", "Methane Demand"),
                ],
                max_length=255,
            ),
        ),
        migrations.AlterField(
            model_name="conversionasset",
            name="type",
            field=models.CharField(
                choices=[
                    ("ELECTRIC_HEATER", "Electric Heater"),
                    ("GAS_BURNER", "Gas Burner"),
                    ("HEAT_DELIVERY_SET", "Heat Delivery Set"),
                    ("HEAT_PUMP_AIR", "Heat Pump Air"),
                    ("HEAT_PUMP_GROUND", "Heat Pump Ground"),
                    ("HEAT_PUMP_WATER", "Heat Pump Water"),
                    ("HYDROGEN_FURNACE", "Hydrogen Furnace"),
                    ("METHANE_FURNACE", "Methane Furnace"),
                    ("ELECTROLYSER", "Electrolyser"),
                    ("CURTAILER", "Curtailer"),
                    ("CURTAILER_HEAT", "Curtailer Heat"),
                    ("METHANE_CHP", "Methane Chp"),
                    ("BIOGAS_METHANE_CONVERTER", "Biogas Methane Converter"),
                ],
                max_length=255,
            ),
        ),
        migrations.AlterField(
            model_name="industrygridconnection",
            name="type",
            field=models.CharField(
                choices=[
                    ("STEEL", "Steel"),
                    ("INDUSTRY_OTHER", "Industry Other"),
                    ("AGRO_ENERGYHUB", "Agro Energyhub"),
                ],
                max_length=25,
            ),
        ),
        migrations.AlterField(
            model_name="productionasset",
            name="type",
            field=models.CharField(
                choices=[
                    ("PHOTOVOLTAIC", "Photovoltaic"),
                    ("WINDMILL", "Windmill"),
                    ("RESIDUALHEATHT", "Residualheatht"),
                    ("RESIDUALHEATLT", "Residualheatlt"),
                    ("LIVESTOCK", "Livestock"),
                ],
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name="storageasset",
            name="type",
            field=models.CharField(
                choices=[
                    ("ELECTRIC_VEHICLE", "Electric Vehicle"),
                    ("STORAGE_ELECTRIC", "Storage Electric"),
                    ("STORAGE_HEAT", "Storage Heat"),
                    ("STORAGE_GAS", "Storage Gas"),
                    ("HEATMODEL", "Heatmodel"),
                ],
                max_length=50,
            ),
        ),
    ]
