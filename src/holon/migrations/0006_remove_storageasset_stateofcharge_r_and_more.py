# Generated by Django 4.1.7 on 2023-03-14 13:23

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("holon", "0005_datamodel_updates"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="storageasset",
            name="stateOfCharge_r",
        ),
        migrations.AddField(
            model_name="districtheatinggridconnection",
            name="smart_assets",
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="electricstorageasset",
            name="stateOfCharge_r",
            field=models.FloatField(default=0.5),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="hybridheatcoversionasset",
            name="capacityElectricity_kW",
            field=models.FloatField(default=0),
            preserve_default=False,
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
                ],
                max_length=255,
            ),
        ),
        migrations.AlterField(
            model_name="housegridconnection",
            name="type",
            field=models.CharField(
                choices=[
                    ("SEMIDETACHED", "Semidetached"),
                    ("TERRACED", "Terraced"),
                    ("DETACHED", "Detached"),
                    ("APPARTMENT", "Appartment"),
                    ("HIGHRISE", "Highrise"),
                ],
                max_length=100,
            ),
        ),
    ]
