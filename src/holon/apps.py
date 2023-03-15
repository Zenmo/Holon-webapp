import sys

from django.apps import AppConfig


class HolonConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "holon"

    def ready(self):
        if "makemigrations" in sys.argv or "migrate" in sys.argv:
            from .models.rule_actions.rule_action_balance_group import RuleActionBalanceGroup

            RuleActionBalanceGroup.selected_model_type_name.field.choices = None
