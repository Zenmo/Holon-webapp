# Generated by Django 4.1.9 on 2023-06-14 13:35

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("holon", "0048_alter_energyasset_gridconnection_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="ruleactionbalancegroup",
            name="rule",
        ),
        migrations.RemoveField(
            model_name="ruleactionbalancegroup",
            name="ruleaction_ptr",
        ),
        migrations.DeleteModel(
            name="BalanceGroupModelOrder",
        ),
        migrations.DeleteModel(
            name="RuleActionBalanceGroup",
        ),
    ]
