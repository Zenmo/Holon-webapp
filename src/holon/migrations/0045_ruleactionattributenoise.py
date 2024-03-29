# Generated by Django 4.1.9 on 2023-06-07 10:11

from django.db import migrations, models
import django.db.models.deletion
import modelcluster.fields


class Migration(migrations.Migration):

    dependencies = [
        ("holon", "0044_alter_filtersubselector_amount_type_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="RuleActionAttributeNoise",
            fields=[
                (
                    "ruleaction_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="holon.ruleaction",
                    ),
                ),
                ("model_attribute", models.CharField(max_length=255)),
                (
                    "noise_type",
                    models.CharField(
                        choices=[
                            ("UNIFORM", "Uniform"),
                            ("NORMAL", "Normal"),
                            ("TRIANGLE", "Triangle"),
                        ],
                        max_length=31,
                    ),
                ),
                ("min_value", models.FloatField()),
                ("max_value", models.FloatField()),
                ("mean", models.FloatField()),
                ("sigma", models.FloatField()),
                (
                    "rule",
                    modelcluster.fields.ParentalKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="discrete_factors_attribute_noise",
                        to="holon.scenariorule",
                    ),
                ),
            ],
            options={
                "verbose_name": "RuleActionAttributeNoise",
            },
            bases=("holon.ruleaction",),
        ),
    ]
