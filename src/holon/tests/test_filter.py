from django.test import TestCase

from holon.models import *
from holon.models import rule_mapping


class RuleFiltersTestClass(TestCase):
    def setUp(self) -> None:
        self.scenario: Scenario = Scenario.objects.create(name="test", etm_scenario_id=1)
        actor: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )
        self.gridconnection_1: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=actor,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.D,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.gridconnection_2: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=actor,
            capacity_kw=550.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.gridconnection_3: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=actor,
            capacity_kw=1000.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.B,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.gridconnection_4: DistrictHeatingGridConnection = (
            DistrictHeatingGridConnection.objects.create(
                owner_actor=actor,
                capacity_kw=550.0,
                payload=self.scenario,
                heating_type=HeatingType.GASBURNER,
                type=DistrictHeatingType.MT,
            )
        )

        self.interactive_element: InteractiveElement = InteractiveElement.objects.create(
            scenario=self.scenario, name="Input 1", type=ChoiceType.continuous
        )
        self.rule = ScenarioRule.objects.create(
            interactive_element=self.interactive_element,
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

    def test_attribute_filter_greater_than(self) -> None:
        # Arange
        scenario: Scenario = rule_mapping.get_prefetched_scenario(self.scenario.id)
        queryset = rule_mapping.get_queryset_for_rule(self.rule, scenario)
        AttributeFilter.objects.create(
            rule=self.rule,
            model_attribute="capacity_kw",
            comparator=AttributeFilterComparator.GREATER_THAN,
            value=700.0,
        )

        # Act
        filtered_queryset = rule_mapping.apply_rule_filters_to_queryset(queryset, self.rule)

        # Assert
        self.assertEqual(len(filtered_queryset), 2)

    def test_attribute_filter_without_rule_subtype(self) -> None:
        # Arange
        self.rule.model_subtype = ""
        self.rule.save()
        scenario: Scenario = rule_mapping.get_prefetched_scenario(self.scenario.id)
        queryset = rule_mapping.get_queryset_for_rule(self.rule, scenario)
        AttributeFilter.objects.create(
            rule=self.rule,
            model_attribute="capacity_kw",
            comparator=AttributeFilterComparator.GREATER_THAN,
            value=0.0,
        )

        # Act
        filtered_queryset = rule_mapping.apply_rule_filters_to_queryset(queryset, self.rule)

        # Assert
        self.assertEqual(len(filtered_queryset), 4)

    def test_relation_filter_greater_than(self) -> None:
        # Arange
        asset_1: EnergyAsset = EnergyAsset.objects.create(
            gridconnection=self.gridconnection_1, name="asset 1"
        )
        asset_2: EnergyAsset = EnergyAsset.objects.create(
            gridconnection=self.gridconnection_2, name="asset 2"
        )
        rule_asset = ScenarioRule.objects.create(
            interactive_element=self.interactive_element,
            model_type=ModelType.ENERGYASSET,
            model_subtype="",
        )

        scenario: Scenario = rule_mapping.get_prefetched_scenario(self.scenario.id)
        queryset = rule_mapping.get_queryset_for_rule(rule_asset, scenario)
        RelationAttributeFilter.objects.create(
            rule=rule_asset,
            model_attribute="capacity_kw",
            comparator=AttributeFilterComparator.GREATER_THAN,
            value=700.0,
            relation_field="gridconnection",
            relation_field_subtype="BuildingGridConnection",
        )

        # Act
        filtered_queryset = rule_mapping.apply_rule_filters_to_queryset(queryset, rule_asset)

        # Assert
        self.assertEqual(len(filtered_queryset), 1)
