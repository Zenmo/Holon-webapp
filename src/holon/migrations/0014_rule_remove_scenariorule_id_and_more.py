# Generated by Django 4.1.7 on 2023-03-16 12:22

from django.db import migrations, models
import django.db.models.deletion
import modelcluster.fields


class Migration(migrations.Migration):
    dependencies = [
        ("contenttypes", "0002_remove_content_type_name"),
        ("holon", "0013_remove_datamodelconversion_filter_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Rule",
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
                "verbose_name": "Rule",
            },
        ),
        migrations.RemoveField(
            model_name="scenariorule",
            name="id",
        ),
        migrations.RemoveField(
            model_name="scenariorule",
            name="model_subtype",
        ),
        migrations.RemoveField(
            model_name="scenariorule",
            name="model_type",
        ),
        migrations.AddField(
            model_name="scenariorule",
            name="rule_ptr",
            field=models.OneToOneField(
                auto_created=True,
                default=0,
                on_delete=django.db.models.deletion.CASCADE,
                parent_link=True,
                primary_key=True,
                serialize=False,
                to="holon.rule",
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="attributefilter",
            name="rule",
            field=modelcluster.fields.ParentalKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="attribute_filters",
                to="holon.rule",
            ),
        ),
        migrations.AlterField(
            model_name="discreteattributefilter",
            name="rule",
            field=modelcluster.fields.ParentalKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="discrete_attribute_filters",
                to="holon.rule",
            ),
        ),
        migrations.AlterField(
            model_name="relationattributefilter",
            name="rule",
            field=modelcluster.fields.ParentalKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="relation_attribute_filters",
                to="holon.rule",
            ),
        ),
        migrations.CreateModel(
            name="DatamodelQueryRule",
            fields=[
                (
                    "rule_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="holon.rule",
                    ),
                ),
                (
                    "self_conversion",
                    models.CharField(choices=[("SUM", "Sum"), ("COUNT", "Count")], max_length=255),
                ),
                (
                    "attribute_to_sum",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                (
                    "datamodel_conversion_step",
                    modelcluster.fields.ParentalKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="datamodel_query_rule",
                        to="holon.datamodelconversion",
                    ),
                ),
            ],
            options={
                "verbose_name": "DatamodelQueryRule",
            },
            bases=("holon.rule",),
        ),
    ]
