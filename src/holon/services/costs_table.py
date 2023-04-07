"""Create a Costs&Benefits Table """


class CostsTable:
    def __init__(self, cost_items) -> None:
        """cost_items is a generator of CostItems"""
        self.table = cost_items

    @property
    def table(self):
        return self._table

    @table.setter
    def table(self, cost_items):
        self._table = {}
        for item in cost_items:
            self.__add_to_table(item)

    def __add_to_table(self, item):
        """TODO: also work with subgroups"""
        try:
            self._table[item.from_group()][item.to_group()] += item.price
        except KeyError:
            self.__add_from_group(item)
        except TypeError:
            self.__add_to_group(item)

    def __add_to_group(self, item):
        try:
            self._table[item.from_group()][item.to_group()] = item.price
        except KeyError:
            self.__add_from_group(item)

    def __add_from_group(self, item):
        """
        Also needs to add self as None
        --> are we sure like this we always have all the keys?
        Probably in the output (as_totals) we need to rebuild the thing for all
        the different groups to be present
        """

        self._table[item.from_group()] = {
            item.to_group(): item.price,
            item.from_group(): None,
        }

    def as_totals(self):
        """TODO: returns the main groups view"""

    def as_detailed_view(self, group):
        """TODO: returns detailed view for the group"""

    @classmethod
    def from_al_output(cls, al_output, scenario):
        actors = ActorWrapper.from_scenario(scenario)
        return cls((CostItem.from_dict(item, actors) for item in al_output))


class ActorWrapper:
    def __init__(self, actors) -> None:
        """Where actors is the Django equivalent of AR relation of Actors of the scenario"""
        self.actors = actors

    def find(self, actor_name):
        """
        Strips the AL prefix from the actor name and returns the corresponding Actor
        TODO: Validate: does this actor exists -> what do we do if not
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

    @staticmethod
    def group(actor):
        """Fallback to category if group is not defined"""
        try:
            return actor.group.name
        except AttributeError:
            return actor.category

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
            + CostItem.delivery_price(obj)
            + obj.get("annualFee_eur", 0.0)
        )

    @staticmethod
    def delivery_price(obj) -> float:
        """Check for the delivery price. If no prices sets defaults to 0"""
        return obj.get("EnergyTransactionVolume_kWh", 0.0) * (
            obj.get("deliveryTax_eurpkWh", 0.0) + obj.get("deliveryPrice_eurpkWh", 0.0)
        )

    @classmethod
    def from_dict(cls, obj: dict, actors: ActorWrapper):
        return cls(
            actors.find(obj["contractScope"]),
            actors.find(obj["contractHolder"]),
            CostItem.price_for(obj),
        )
