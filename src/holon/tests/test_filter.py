from django.test import TestCase

from holon.models import *
from holon.models import rule_mapping


class RuleFiltersTestClass(TestCase):
    def setUp(self) -> None:
        self.scenario: Scenario = Scenario.objects.create(name="test")
        self.actor: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )
        self.gridconnection_1: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.D,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.gridconnection_2: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor,
            capacity_kw=550.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.gridconnection_3: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor,
            capacity_kw=1000.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.B,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.gridconnection_4: DistrictHeatingGridConnection = (
            DistrictHeatingGridConnection.objects.create(
                owner_actor=self.actor,
                capacity_kw=550.0,
                payload=self.scenario,
                heating_type=HeatingType.GASBURNER,
                type=DistrictHeatingType.MT,
            )
        )

    def test_attribute_filter_greater_than(self) -> None:
        # Arange

        rule: Rule = Rule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        AttributeFilter.objects.create(
            rule=rule,
            model_attribute="capacity_kw",
            comparator=AttributeFilterComparator.GREATER_THAN,
            value=700.0,
        )

        # Act
        filtered_queryset = rule.get_filtered_queryset(self.scenario)

        # Assert
        self.assertEqual(len(filtered_queryset), 2)

    def test_attribute_filter_without_rule_subtype(self) -> None:
        # Arange

        rule: Rule = Rule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="",
        )

        AttributeFilter.objects.create(
            rule=rule,
            model_attribute="capacity_kw",
            comparator=AttributeFilterComparator.GREATER_THAN,
            value=0.0,
        )

        # Act
        filtered_queryset = rule.get_filtered_queryset(self.scenario)

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
        rule_asset = Rule.objects.create(
            model_type=ModelType.ENERGYASSET,
            model_subtype="",
        )

        RelationAttributeFilter.objects.create(
            rule=rule_asset,
            model_attribute="capacity_kw",
            comparator=AttributeFilterComparator.GREATER_THAN,
            value=700.0,
            relation_field="gridconnection",
            relation_field_subtype="BuildingGridConnection",
        )

        # Act
        filtered_queryset = rule_asset.get_filtered_queryset(self.scenario)

        # Assert
        self.assertEqual(len(filtered_queryset), 1)

    def test_relation_discrete_filter_greater_than(self) -> None:
        # Arange
        # Add gridconnection with insulationtype none, which should be ignored
        BuildingGridConnection.objects.create(
            owner_actor=self.actor,
            capacity_kw=550.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.NONE,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )

        rule_gridconnection = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        DiscreteAttributeFilter.objects.create(
            rule=rule_gridconnection,
            model_attribute="insulation_label",
            comparator=AttributeFilterComparator.GREATER_THAN,
            value=InsulationLabel.C,
        )

        # Act
        filtered_queryset = rule_gridconnection.get_filtered_queryset(self.scenario)

        # Assert
        self.assertEqual(len(filtered_queryset), 2)
        for gridconnection in filtered_queryset:
            self.assertTrue(
                gridconnection.insulation_label in [InsulationLabel.A, InsulationLabel.B]
            )
