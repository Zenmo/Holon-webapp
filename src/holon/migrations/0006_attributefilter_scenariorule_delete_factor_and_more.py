# Generated by Django 4.1.6 on 2023-02-24 12:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("contenttypes", "0002_remove_content_type_name"),
        ("holon", "0005_remove_consumptionasset_name_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="AttributeFilter",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("model_attribute", models.CharField(max_length=255, null=True)),
                (
                    "comparator",
                    models.CharField(
                        choices=[
                            ("EQUAL", "Equal"),
                            ("LESS THAN", "Less Than"),
                            ("GREATER THAN", "Greater Than"),
                            ("NOT EQUAL", "Not Equal"),
                        ],
                        max_length=255,
                    ),
                ),
                ("value", models.JSONField()),
                (
                    "polymorphic_ctype",
                    models.ForeignKey(
                        editable=False,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="polymorphic_%(app_label)s.%(class)s_set+",
                        to="contenttypes.contenttype",
                    ),
                ),
            ],
            options={
                "verbose_name": "AttributeFilter",
            },
        ),
        migrations.CreateModel(
            name="ScenarioRule",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "model_type",
                    models.CharField(
                        choices=[
                            ("Actor", "Actor"),
                            ("EnergyAsset", "Energyasset"),
                            ("GridNode", "Gridnode"),
                            ("GridConnection", "Gridconnection"),
                            ("Policy", "Policy"),
                        ],
                        max_length=255,
                    ),
                ),
                (
                    "model_subtype",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                (
                    "interactive_element",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="rules",
                        to="holon.interactiveelement",
                    ),
                ),
            ],
            options={
                "verbose_name": "ScenarioRule",
            },
        ),
        migrations.DeleteModel(
            name="Factor",
        ),
        migrations.AlterField(
            model_name="policy",
            name="payload",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="holon.scenario"
            ),
        ),
        migrations.CreateModel(
            name="RelationAttributeFilter",
            fields=[
                (
                    "attributefilter_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="holon.attributefilter",
                    ),
                ),
                ("relation_field", models.CharField(max_length=255)),
                (
                    "relation_field_subtype",
                    models.CharField(blank=True, max_length=255),
                ),
            ],
            options={
                "verbose_name": "RelationAttributeFilter",
            },
            bases=("holon.attributefilter",),
        ),
        migrations.AddField(
            model_name="attributefilter",
            name="rule",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="filters",
                to="holon.scenariorule",
            ),
        ),
    ]