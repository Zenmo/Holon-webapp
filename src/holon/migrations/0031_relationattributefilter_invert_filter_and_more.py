# Generated by Django 4.1.7 on 2023-04-05 14:04

from django.db import migrations, models
import django.db.models.deletion
import modelcluster.fields


class Migration(migrations.Migration):

    dependencies = [
        ("contenttypes", "0002_remove_content_type_name"),
        ("holon", "0031_policy_name"),
    ]

    operations = [
        migrations.AddField(
            model_name="relationattributefilter",
            name="invert_filter",
            field=models.BooleanField(
                default=False,
                help_text="Filter models that don't satisfy the model attribute comparison",
            ),
        ),
        migrations.AlterField(
            model_name="attributefilter",
            name="model_attribute",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="attributefilter",
            name="value",
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="discreteattributefilter",
            name="model_attribute",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="discreteattributefilter",
            name="value",
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="relationattributefilter",
            name="model_attribute",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="relationattributefilter",
            name="value",
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name="RelationExistsFilter",
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
                    "model_attribute",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
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
                ("value", models.JSONField(blank=True, null=True)),
                ("relation_field", models.CharField(max_length=255)),
                (
                    "relation_field_subtype",
                    models.CharField(blank=True, max_length=255),
                ),
                (
                    "invert_filter",
                    models.BooleanField(
                        default=False,
                        help_text="Filter models that don't have the specified relation",
                    ),
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
                (
                    "rule",
                    modelcluster.fields.ParentalKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="relation_exists_filters",
                        to="holon.rule",
                    ),
                ),
            ],
            options={
                "verbose_name": "RelationAttributeFilter",
            },
        ),
    ]