# Generated by Django 4.1.7 on 2023-03-01 09:55

from django.db import migrations, models
import django.db.models.deletion
import modelcluster.fields


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0014_merge_20230210_1042"),
        ("holon", "0005_remove_consumptionasset_name_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="AnylogicCloudConfig",
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
                ("api_key", models.CharField(max_length=40)),
                (
                    "url",
                    models.URLField(
                        default="https://engine.holontool.nl", max_length=100
                    ),
                ),
                ("model_name", models.CharField(max_length=100)),
                (
                    "model_version_number",
                    models.IntegerField(
                        help_text="Use this field to define the AnyLogic Cloud model version number"
                    ),
                ),
                (
                    "owner_email",
                    models.EmailField(
                        help_text="This will be used to send the owner emails when things break",
                        max_length=254,
                    ),
                ),
            ],
            options={
                "verbose_name": "Anylogic cloudclient configuratie",
            },
        ),
        migrations.CreateModel(
            name="CostBenifitConfig",
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
            ],
            options={
                "verbose_name": "Kosten&baten configuratie",
            },
        ),
        migrations.CreateModel(
            name="ETMQuery",
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
                    "internal_key",
                    models.CharField(
                        help_text="Key that is used internally (downstream) to access the data associated with this query result",
                        max_length=35,
                    ),
                ),
                (
                    "endpoint",
                    models.CharField(
                        choices=[
                            ("input", "Input"),
                            ("query", "Query"),
                            ("curve", "Curve"),
                        ],
                        max_length=255,
                    ),
                ),
                (
                    "data_type",
                    models.CharField(
                        choices=[("value", "Value"), ("curve", "Curve")], max_length=255
                    ),
                ),
                (
                    "etm_key",
                    models.CharField(
                        help_text="Key as defined in the ETM", max_length=255
                    ),
                ),
                (
                    "interactive_upscaling_comment",
                    models.CharField(
                        blank=True,
                        help_text="Use this field to explain the query in the front-end. Use {{variable}} for dynamic values. Options: local key-value pairs e.g., `scaling_factor`, `final_value` or `query_value` (to be implemented)",
                        max_length=350,
                        null=True,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="FloatKeyValuePair",
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
                ("key", models.CharField(max_length=255)),
                ("value", models.FloatField()),
            ],
        ),
        migrations.RemoveField(
            model_name="scenario",
            name="etm_scenario_id",
        ),
        migrations.AddField(
            model_name="scenario",
            name="comment",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="scenario",
            name="version",
            field=models.IntegerField(default=1),
        ),
        migrations.CreateModel(
            name="StaticConversion",
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
                    "value",
                    models.FloatField(
                        blank=True, help_text="Value for static conversions", null=True
                    ),
                ),
                (
                    "conversion",
                    models.CharField(
                        choices=[
                            ("multiply", "Multiply"),
                            ("divide", "Divide"),
                            ("in_product", "In Product"),
                        ],
                        max_length=255,
                    ),
                ),
                (
                    "shadow_key",
                    models.CharField(
                        help_text="Internal key, not used by humans but might occur in logs when errors occur",
                        max_length=255,
                    ),
                ),
                (
                    "etm_query",
                    modelcluster.fields.ParentalKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="static_conversion_step",
                        to="holon.etmquery",
                    ),
                ),
                (
                    "local_variable",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="holon.floatkeyvaluepair",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="QueryAndConvertConfig",
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
                    "module",
                    models.CharField(
                        choices=[("upscaling", "Upscaling"), ("cost", "Cost")],
                        max_length=255,
                    ),
                ),
                ("name", models.CharField(blank=True, max_length=255)),
                (
                    "api_url",
                    models.URLField(
                        default="https://beta-engine.energytransitionmodel.com/api/v3/scenarios/"
                    ),
                ),
                ("etm_scenario_id", models.IntegerField()),
                (
                    "scenario",
                    modelcluster.fields.ParentalKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="query_and_convert_config",
                        to="holon.scenario",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="KeyValuePairCollection",
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
                    "related_config",
                    modelcluster.fields.ParentalKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="key_value_pair_collection",
                        to="holon.queryandconvertconfig",
                    ),
                ),
            ],
            options={
                "verbose_name": "ETM module configuratie variabelen",
            },
        ),
        migrations.AddField(
            model_name="floatkeyvaluepair",
            name="related_key_value_collection",
            field=modelcluster.fields.ParentalKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="float_key_value_pair",
                to="holon.keyvaluepaircollection",
            ),
        ),
        migrations.AddField(
            model_name="etmquery",
            name="related_config",
            field=modelcluster.fields.ParentalKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="etm_query",
                to="holon.queryandconvertconfig",
            ),
        ),
        migrations.AddField(
            model_name="etmquery",
            name="related_interactive_element",
            field=models.ForeignKey(
                blank=True,
                help_text="Use this field to relate this query and conversion set to an interactive element (used for rendering in the front-end)",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="api.interactiveinput",
            ),
        ),
        migrations.CreateModel(
            name="ETMConversion",
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
                    "conversion",
                    models.CharField(
                        choices=[
                            ("multiply", "Multiply"),
                            ("divide", "Divide"),
                            ("in_product", "In Product"),
                        ],
                        max_length=255,
                    ),
                ),
                (
                    "conversion_value_type",
                    models.CharField(
                        choices=[("value", "Value"), ("curve", "Curve")], max_length=255
                    ),
                ),
                (
                    "etm_key",
                    models.CharField(
                        help_text="Key as defined in the ETM", max_length=255
                    ),
                ),
                (
                    "shadow_key",
                    models.CharField(
                        help_text="Internal key, not used by humans but might occur in logs when errors occur",
                        max_length=255,
                    ),
                ),
                (
                    "etm_query",
                    modelcluster.fields.ParentalKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="etm_conversion_step",
                        to="holon.etmquery",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="DatamodelConversion",
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
                    "conversion",
                    models.CharField(
                        choices=[
                            ("multiply", "Multiply"),
                            ("divide", "Divide"),
                            ("in_product", "In Product"),
                        ],
                        max_length=255,
                    ),
                ),
                (
                    "conversion_value_type",
                    models.CharField(
                        choices=[("value", "Value"), ("curve", "Curve")], max_length=255
                    ),
                ),
                (
                    "filter",
                    models.CharField(
                        default="not_implemented",
                        help_text="Should be implemented as an inline panel that allows you to filter and select parts of the datamodel as you would",
                        max_length=255,
                    ),
                ),
                (
                    "self_conversion",
                    models.CharField(
                        choices=[("sum", "Sum"), ("count", "Count")],
                        help_text="Operation that is applied to the query set that results from the filter",
                        max_length=255,
                    ),
                ),
                (
                    "shadow_key",
                    models.CharField(
                        help_text="Internal key, not used by humans but might occur in logs when errors occur",
                        max_length=255,
                    ),
                ),
                (
                    "etm_query",
                    modelcluster.fields.ParentalKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="datamodel_conversion_step",
                        to="holon.etmquery",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="AnyLogicConversion",
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
                    "conversion",
                    models.CharField(
                        choices=[
                            ("multiply", "Multiply"),
                            ("divide", "Divide"),
                            ("in_product", "In Product"),
                        ],
                        max_length=255,
                    ),
                ),
                (
                    "conversion_value_type",
                    models.CharField(
                        choices=[("value", "Value"), ("curve", "Curve")], max_length=255
                    ),
                ),
                (
                    "anylogic_key",
                    models.CharField(
                        help_text="Key as defined in the AnyLogic results",
                        max_length=255,
                    ),
                ),
                (
                    "shadow_key",
                    models.CharField(
                        help_text="Internal key, not used by humans but might occur in logs when errors occur",
                        max_length=255,
                    ),
                ),
                (
                    "etm_query",
                    modelcluster.fields.ParentalKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="al_conversion_step",
                        to="holon.etmquery",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="AnylogicCloudOutput",
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
                    "anylogic_key",
                    models.CharField(
                        help_text="Key as provided in the AnyLogic Cloud response JSON",
                        max_length=50,
                    ),
                ),
                (
                    "internal_key",
                    models.CharField(
                        help_text="Key that is used internally to access the data associated with this AnyLogic key",
                        max_length=50,
                    ),
                ),
                (
                    "anylogic_model_configuration",
                    modelcluster.fields.ParentalKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="anylogic_cloud_output",
                        to="holon.anylogiccloudconfig",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="AnylogicCloudInput",
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
                ("anylogic_key", models.CharField(max_length=100)),
                (
                    "anylogic_value",
                    models.JSONField(
                        help_text="JSON format, will be parsed to be at available the same level in the JSON-payload as the other data"
                    ),
                ),
                (
                    "anylogic_model_configuration",
                    modelcluster.fields.ParentalKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="anylogic_cloud_input",
                        to="holon.anylogiccloudconfig",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="anylogiccloudconfig",
            name="scenario",
            field=modelcluster.fields.ParentalKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="anylogic_config",
                to="holon.scenario",
            ),
        ),
    ]