# Generated by Django 4.1.7 on 2023-03-28 12:46

from django.db import migrations, models
import django.db.models.deletion
import modelcluster.fields


class Migration(migrations.Migration):

    dependencies = [
        ("holon", "0022_merge_20230328_1312"),
    ]

    operations = [
        migrations.CreateModel(
            name="RuleActionAddMultipleUnderEachParent",
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
                (
                    "asset_to_add",
                    models.ForeignKey(
                        blank=True,
                        limit_choices_to={"is_rule_action_template": True},
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="holon.energyasset",
                    ),
                ),
                (
                    "contract_to_add",
                    models.ForeignKey(
                        blank=True,
                        limit_choices_to={"is_rule_action_template": True},
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="holon.contract",
                    ),
                ),
                (
                    "gridconnection_to_add",
                    models.ForeignKey(
                        blank=True,
                        limit_choices_to={"is_rule_action_template": True},
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="holon.gridconnection",
                    ),
                ),
                (
                    "rule",
                    modelcluster.fields.ParentalKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="discrete_factors_add_multiple_under_each_parent",
                        to="holon.scenariorule",
                    ),
                ),
            ],
            options={
                "verbose_name": "RuleActionAddMultipleUnderEachParent",
            },
            bases=("holon.ruleaction", models.Model),
        ),
    ]