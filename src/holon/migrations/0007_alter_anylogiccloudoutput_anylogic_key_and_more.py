# Generated by Django 4.1.7 on 2023-03-15 10:04

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("holon", "0006_remove_storageasset_stateofcharge_r_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="anylogiccloudoutput",
            name="anylogic_key",
            field=models.CharField(
                help_text="Key as provided in the AnyLogic Cloud response JSON",
                max_length=255,
            ),
        ),
        migrations.AlterField(
            model_name="anylogiccloudoutput",
            name="internal_key",
            field=models.CharField(
                help_text="Key that is used internally to access the data associated with this AnyLogic key",
                max_length=255,
            ),
        ),
        migrations.AlterField(
            model_name="etmquery",
            name="interactive_upscaling_comment",
            field=models.CharField(
                blank=True,
                help_text="Use this field to explain the query in the front-end. Use {{variable}} for dynamic values. Options: local key-value pairs e.g., `scaling_factor`, `final_value` or `query_value` (to be implemented)",
                max_length=255,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="etmquery",
            name="internal_key",
            field=models.CharField(
                help_text="Key that is used internally (downstream) to access the data associated with this query result",
                max_length=255,
            ),
        ),
    ]
