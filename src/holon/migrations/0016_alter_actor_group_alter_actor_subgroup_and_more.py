# Generated by Django 4.1.7 on 2023-03-20 13:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("holon", "0015_alter_datamodelconversion_conversion_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="actor",
            name="group",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="holon.actorgroup",
            ),
        ),
        migrations.AlterField(
            model_name="actor",
            name="subgroup",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="holon.actorsubgroup",
            ),
        ),
        migrations.AlterField(
            model_name="contract",
            name="contractScope",
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to="holon.actor"),
        ),
    ]
