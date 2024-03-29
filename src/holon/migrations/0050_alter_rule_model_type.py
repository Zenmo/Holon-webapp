# Generated by Django 4.1.9 on 2023-06-15 08:05

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("holon", "0049_remove_ruleactionbalancegroup_rule_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="rule",
            name="model_type",
            field=models.CharField(
                choices=[
                    ("Actor", "Actor"),
                    ("ActorGroup", "Actor Group"),
                    ("ActorSubGroup", "Actor Sub Group"),
                    ("Contract", "Contract"),
                    ("EnergyAsset", "Energyasset"),
                    ("GridNode", "Gridnode"),
                    ("GridConnection", "Gridconnection"),
                    ("Policy", "Policy"),
                    ("Scenario", "Scenario"),
                ],
                max_length=255,
            ),
        ),
    ]
