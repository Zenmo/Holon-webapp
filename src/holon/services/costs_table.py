"""Create a Costs&Benefits Table """

from typing import Union

from holon.models.scenario import Actor, ActorGroup, ActorSubGroup
from holon.models.scenario_rule import ModelType
from holon.rule_engine.scenario_aggregate import ScenarioAggregate
import sentry_sdk
from copy import copy as copy

COSTS_TO_SELF = "Afschrijving"


class CostTables:
    def __init__(self, cost_items: list) -> None:
        """cost_items is a list of CostItems, we now loop it a lot - can that be improved?"""
        self.cost_items = cost_items

    def main_table(self) -> dict[str, dict[str, int]]:
        # filter the cost_items to only include the main groups, without overlapping subgroups
        main_cost_items = copy(self.cost_items)
        for cost_item in main_cost_items:
            if isinstance(cost_item, CostToSelfItem):
                if cost_item.group == "Undefined":
                    main_cost_items.remove(cost_item)
                    sentry_sdk.capture_exception(
                        ValueError("CostToSelfItem with group Undefined found in main table!")
                    )
                    continue

                # remove all groups that are not the main group (to prevent double counting)
                if cost_item.subgroup is not None:
                    main_cost_items.remove(cost_item)
                    continue

        return CostTable(main_cost_items).table

    def detailed_table(self, group: str) -> dict[str, dict[str, int]]:
        detail_cost_items = copy(self.cost_items)

        for cost_item in detail_cost_items:
            # only remove the CostToSelfItems
            if isinstance(cost_item, CostToSelfItem):
                # remove undefined cost items but log them!
                if cost_item.group == "Undefined":
                    detail_cost_items.remove(cost_item)
                    sentry_sdk.capture_exception(
                        ValueError(
                            f"CostToSelfItem with group Undefined found in detail table for group {group}!"
                        )
                    )
                    continue

                # remove all groups that are not the main group (to prevent double counting)
                if cost_item.subgroup is None:
                    detail_cost_items.remove(cost_item)
                    continue

        table = CostTable(detail_cost_items, use_subgroup=group).table

        # filter out the zero transactions
        filtered_table = {}
        for key, value in table.items():
            if sum(value.values()) != 0:
                filtered_table.update({key: value})

        # sort the table based on whether the key contains the group of interest
        sorted_table = {
            key: filtered_table[key]
            for key in sorted(filtered_table.keys(), key=lambda x: group not in x)
        }

        return sorted_table

    def groups_for_detailed(self) -> set:
        return set((group for item in self.cost_items for group in item.with_subgroups()))

    def all_detailed_tables(self) -> dict[str, dict[str, dict[str, int]]]:
        """
        Returns a dict where the keys are the applicable actor groups
        and the values are their detailed tables
        """
        return {group: self.detailed_table(group) for group in self.groups_for_detailed()}

    def inject_costs_to_self(self, group: str, costs: float):
        """
        Injects one cost item into the table
        """
        self.cost_items.append(CostToSelfItem(group, costs))

    def inject_depreciation_costs(self, items: dict):
        """
        Injects multiple cost items to self into the table

        items[dict]:    key value pairs of actor names and costs
        """
        for group, value in items.items():
            self.inject_costs_to_self(group, -1 * value)

    @classmethod
    def from_al_output(cls, al_output, scenario_aggregate: ScenarioAggregate):
        actors = ActorWrapper.from_scenario(scenario_aggregate)
        return cls([CostItem.from_dict(item, actors) for item in al_output])


class CostTable:
    def __init__(self, cost_items, use_subgroup=None) -> None:
        """cost_items is a list of CostItems"""
        self._use_subgroup = use_subgroup
        self.table = cost_items

    @property
    def table(self):
        return self._table

    @table.setter
    def table(self, cost_items):
        self._table = {}
        for item in cost_items:
            self.__add_to_table(item)
            if item.reversable():
                self.__add_to_table(CostItem.reversed(item))
        self.__fill_out_table()
        self.__round_table()

    def __add_to_table(self, item):
        """Adds the item to the table"""
        try:
            self._table[self.__name_from(item)][self.__name_to(item)] += item.price
        except:
            self.__add_to_group(item)

    def __add_to_group(self, item):
        try:
            self._table[self.__name_from(item)][self.__name_to(item)] = item.price
        except KeyError:
            self.__add_from_group(item)

    def __add_from_group(self, item):
        """
        Also needs to add self as None
        TODO: move some functionality from fill_out_table here
        """
        self._table[self.__name_from(item)] = {self.__name_to(item): item.price}

    def __fill_out_table(self):
        # we can also keep a global set in memory (self) where we add to in __add_from_group
        all_groups = set((key for value in self.table.values() for key in value.keys()))
        basic = {key: 0.0 for key in all_groups} | {COSTS_TO_SELF: 0.0}
        for group in all_groups:
            if group == COSTS_TO_SELF:
                continue
            self._table[group] = basic | self._table.get(group, {})
            self._table[group]["Netto kosten"] = sum(
                (value for value in self._table[group].values() if value is not None)
            )

    def __round_table(self):
        """loops through the final table and rounds all values"""

        for holder, transactions in self._table.items():
            try:
                for scope, transaction in transactions.items():
                    self._table[holder][scope] = int(transaction)
            except TypeError:  # unsure if we ever get deeper, but just to be sure
                for deeper_scope, deeper_transaction in transaction.items():
                    self._table[holder][scope][deeper_scope] = int(deeper_transaction)

    def __name_from(self, item):
        return (
            item.from_subgroup() if self._use_subgroup == item.from_group() else item.from_group()
        )

    def __name_to(self, item):
        return item.to_subgroup() if self._use_subgroup == item.to_group() else item.to_group()


class ActorWrapper:
    def __init__(self, id_to_actor: dict[int, Actor]) -> None:
        """Where actors is the Django equivalent of AR relation of Actors of the scenario"""
        self.id_to_actor = id_to_actor

    def find(self, actor_name):
        """
        Strips the AL prefix from the actor name and returns the corresponding Actor
        """
        return self.id_to_actor[int(actor_name[3:])]

    @classmethod
    def from_scenario(cls, scenario_aggregate: ScenarioAggregate):
        # In scenario "Transitie Visie Warmte"
        # doing this eagerly prevents many thousands of queries
        # even though there are only 44 actors.
        id_to_actor: dict[int, Actor] = scenario_aggregate.repositories[ModelType.ACTOR].dict()

        return cls(id_to_actor)


class CostItem:
    """Represents one contract in the AL output"""

    def __init__(self, to_actor, from_actor, price) -> None:
        self.from_actor = from_actor
        self.to_actor = to_actor
        self.price = price

    def from_group(self):
        return CostItem.group(self.from_actor)

    def to_group(self):
        return CostItem.group(self.to_actor)

    def from_subgroup(self):
        return CostItem.subgroup(self.from_actor)

    def to_subgroup(self):
        return CostItem.subgroup(self.to_actor)

    def with_subgroups(self):
        """Returns groups that are connected to a subgroup"""
        if not self.from_actor.subgroup is None:
            yield self.from_group()
        if not self.to_actor.subgroup is None:
            yield self.to_group()

    def reversable(self):
        return True

    @staticmethod
    def group(actor):
        """Fallback to category if group is not defined"""
        try:
            return actor.group.name
        except AttributeError:
            return actor.category

    @staticmethod
    def subgroup(actor):
        """Fallback to group if subgroup is not defined"""
        try:
            return f"{CostItem.group(actor)} - {actor.subgroup.name}"
        except AttributeError:
            return CostItem.group(actor)

    @staticmethod
    def group_key_name(
        group: Union[ActorGroup, None], sub_group: Union[ActorSubGroup, None] = None
    ) -> str:
        """Returns the key name for the group"""
        if sub_group is None:
            if group is None:
                return "Onbekend"
            else:
                return group.name
        else:
            if group is None:
                return f"Onbekend - {sub_group.name}"
            else:
                return f"{group.name} - {sub_group.name}"

    @staticmethod
    def price_for(obj) -> float:
        """
        FinancialTransactionVolume_eur includes all contract cost:
            1. Energycarrier_volume x Energycarrier_price
            2. Annual_fee
            3. Taxes
               -> All parameters are determined in AnyLogic

        Defaults to 0.0
        """
        return -obj.get("FinancialTransactionVolume_eur", 0.0)
        # should be negative because costs are negative in frontend
        # but positive output from Anylogic

    @staticmethod
    def delivery_or_feedin_price(obj) -> float:
        """Redundant function: Check for the delivery price. If no prices sets defaults to 0"""
        volume = obj.get("EnergyTransactionVolume_kWh", 0.0)
        if volume > 0:
            return volume * (
                obj.get("feedinTax_eurpkWh", 0.0) + obj.get("feedinPrice_eurpkWh", 0.0)
            )
        return volume * (
            obj.get("deliveryTax_eurpkWh", 0.0) + obj.get("deliveryPrice_eurpkWh", 0.0)
        )

    @classmethod
    def from_dict(cls, obj: dict, actors: ActorWrapper):
        return cls(
            from_actor=actors.find(obj["contractHolder"]),
            to_actor=actors.find(obj["contractScope"]),
            price=CostItem.price_for(obj),
        )

    @classmethod
    def reversed(cls, obj: "CostItem"):
        """Takes a CostItem returns a new CostItem with the from and to actors switched and the price negated"""
        return cls(
            to_actor=obj.from_actor,
            from_actor=obj.to_actor,
            price=-obj.price,
        )


class CostToSelfItem:
    def __init__(self, group, price) -> None:
        if len(group.split("-")) > 1:
            self.group = group.split(" - ")[0]
            self.subgroup = group
        else:
            self.subgroup = None
            self.group = group
        self.price = price

    def from_group(self):
        return self.group

    def to_group(self):
        return COSTS_TO_SELF

    def from_subgroup(self):
        if self.subgroup is None:
            return self.group
        return self.subgroup

    def to_subgroup(self):
        return COSTS_TO_SELF

    def with_subgroups(self):
        if self.subgroup is not None:
            yield self.group

    def reversable(self):
        return False
