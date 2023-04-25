"""Create a Costs&Benefits Table """


class CostTables:
    def __init__(self, cost_items: list) -> None:
        """cost_items is a list of CostItems, we now loop it a lot - can that be improved?"""
        self.cost_items = cost_items

    def main_table(self) -> dict:
        return CostTable(self.cost_items).table

    def detailed_table(self, group) -> dict:
        return CostTable(self.cost_items, use_subgroup=group).table

    def groups_for_detailed(self) -> set:
        return set((group for item in self.cost_items for group in item.with_subgroups()))

    def all_detailed_tables(self) -> dict:
        """
        Returns a dict where the keys are the applicable actor groups
        and the values are their detailed tables
        """
        return {group: self.detailed_table(group) for group in self.groups_for_detailed()}

    @classmethod
    def from_al_output(cls, al_output, scenario):
        actors = ActorWrapper.from_scenario(scenario)
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
            self.__add_to_table(CostItem.reversed(item))
        self.__fill_out_table()

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
        self._table[self.__name_from(item)] = {
            self.__name_to(item): item.price,
            self.__name_from(item): 0.0,
        }

    def __fill_out_table(self):
        # we can also keep a global set in memory (self) where we add to in __add_from_group
        all_groups = set((key for value in self.table.values() for key in value.keys()))
        basic = {key: 0.0 for key in all_groups}
        for group in all_groups:
            self._table[group] = basic | self._table.get(group, {})
            self._table[group]["Netto kosten"] = sum(
                (value for value in self._table[group].values() if value is not None)
            )

    def __name_from(self, item):
        return (
            item.from_subgroup() if self._use_subgroup == item.from_group() else item.from_group()
        )

    def __name_to(self, item):
        return item.to_subgroup() if self._use_subgroup == item.to_group() else item.to_group()


class ActorWrapper:
    def __init__(self, actors) -> None:
        """Where actors is the Django equivalent of AR relation of Actors of the scenario"""
        self.actors = actors

    def find(self, actor_name):
        """
        Strips the AL prefix from the actor name and returns the corresponding Actor
        """
        return self.actors.get(id=int(actor_name[3:]))

    @classmethod
    def from_scenario(cls, scenario):
        return cls(scenario.actor_set)


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
        if self.from_actor.subgroup:
            yield self.from_group()
        if self.to_actor.subgroup:
            yield self.to_group()

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
    def price_for(obj) -> float:
        """
        Either FinancialTransactionVolume_eur is 0, or delivery_price is 0
        Add annual costs to this.
        Returns the contracts total price

        Defaults to 0.0
        """
        return (
            obj.get("FinancialTransactionVolume_eur", 0.0)
            + CostItem.delivery_or_feedin_price(obj)
            + obj.get("annualFee_eur", 0.0)
        )

    @staticmethod
    def delivery_or_feedin_price(obj) -> float:
        """Check for the delivery price. If no prices sets defaults to 0"""
        volume = obj.get("EnergyTransactionVolume_kWh", 0.0)
        if volume < 0:
            return volume * (
                obj.get("feedinTax_eurpkWh", 0.0) + obj.get("feedinPrice_eurpkWh", 0.0)
            )
        return volume * (
            obj.get("deliveryTax_eurpkWh", 0.0) + obj.get("deliveryPrice_eurpkWh", 0.0)
        )

    @classmethod
    def from_dict(cls, obj: dict, actors: ActorWrapper):
        return cls(
            actors.find(obj["contractScope"]),
            actors.find(obj["contractHolder"]),
            CostItem.price_for(obj),
        )

    @classmethod
    def reversed(cls, obj: "CostItem"):
        """Takes a CostItem returns a new CostItem with the from and to actors switched and the price negated"""
        return cls(
            to_actor=obj.from_actor,
            from_actor=obj.to_actor,
            price=-obj.price,
        )
