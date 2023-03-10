from django.db import models

from holon.models.rule_actions.rule_action_utils import RuleActionUtils

class RuleActionModel(models.Model):
    """ Superclass for classes that are addable/balanceable in a RuleAction """

    # TODO set parent class and field names in init?

    def get_parent_classes_and_field_names(self) -> list[tuple[type, str]]:
        """
        Get the class type(s) and field name(s) of the foreign key fields of the child class.
        """

        return RuleActionUtils.get_parent_classes_and_field_names(self.__class__)