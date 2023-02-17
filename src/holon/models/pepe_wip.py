from django.apps import apps
from django.db.models import Q

from holon.models.asset import EnergyAsset
from holon.models.scenario import Scenario
from holon.models.scenario_rule import ModelType

scenario = (
    Scenario.objects.prefetch_related("actor_set")
    .prefetch_related("gridconnection_set")
    .prefetch_related("gridconnection_set__energyasset_set")
    .prefetch_related("gridnode_set")
    .prefetch_related("policy_set")
    .get(id=1)
)

# Gather assets seperatly because they can be spread out over multiple grid connections
assets = EnergyAsset.objects.none()
for gridconnection in scenario.gridconnection_set.all():
    assets = assets | gridconnection.energyasset_set.all()

serializer = None  ## from pepe
interactive_inputs = serializer.validated_data


for interactive_input in interactive_inputs:
    interactive_element = interactive_input.interactive_element

    for rule in interactive_element.rules.all():
        queryset = None
        if rule.model_type == ModelType.ACTOR:
            queryset = scenario.actor_set.all()
        elif rule.model_type == ModelType.ENERGYASSET:
            queryset = assets
        elif rule.model_type == ModelType.GRIDNODE:
            queryset = scenario.gridnode_set.all()
        elif rule.model_type == ModelType.GRIDCONNECTION:
            queryset = scenario.gridconnection_set.all()
        elif rule.model_type == ModelType.POLICY:
            queryset = scenario.policy_set.all()
        else:
            raise Exception("Not implemented model type")

        if rule.model_subtype is not None and rule.model_subtype != "":
            submodel = apps.get_model("holon", rule.model_subtype)
            queryset = queryset.instance_of(submodel)

        # Use Q() for filtering
        # chaining filter()/exclude() will lead to duplicate records
        # filter with dict destructering doesn't have not equal operator
        queryset_filter = Q()
        for filter in rule.filters.all():
            queryset_filter &= filter.getQ()

        queryset = queryset.filter(queryset_filter)

        for factor in rule.factors:
            # apply factor to objects
            # TODO make more generic if different factors come into play
            for object in queryset:
                mapped_value = (factor.max_value - factor.min_value) * (
                    float(interactive_input.value)
                    / 100  # TODO: cast here to float, but bro should that not just be a float?
                ) + factor.min_value

                setattr(object, rule.asset_attribute, mapped_value)

            # note: django update function immediatly saves the result, so can't be used
