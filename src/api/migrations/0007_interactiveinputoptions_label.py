# Generated by Django 4.1.3 on 2022-11-29 13:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0006_interactiveinput_asset_type_interactiveinput_etm_key_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="interactiveinputoptions",
            name="label",
            field=models.CharField(
                blank=True, help_text="Fill in your option", max_length=255, null=True
            ),
        ),
    ]