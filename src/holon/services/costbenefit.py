# start class script
from functools import partial


class CostBenedict:
    """it's not the egg it claims to be"""

    ## HARDCODED for now ;)
    WANT_TO_KNOW = {
        "Energieleverancier": "balanceElectricityDelivery_eur",
        "Netbeheerder": "balanceElectricityTransport_eur",
        "Overheid": "balanceElectricityTax_eur",
    }

    def __init__(self, actors: list) -> None:
        self.actors = actors
        self.WANT_TO_KNOW

    def determine_group_costs(self):
        return self.determine_cost(groupby="group", want_to_know=self.WANT_TO_KNOW)

    def determine_cost(self, groupby: str, want_to_know: dict):
        result = {}
        groups = set()
        for actor in self.actors:
            if actor[groupby]:
                groups.add(actor[groupby])

        for group in groups:
            filter_on_groupby = partial(self.filter_on_key, key=groupby, value=group)
            group_members = list(filter(filter_on_groupby, self.actors))

            result.update(
                self.sum_values(group=group, group_members=group_members, want_to_know=want_to_know)
            )

        # sort to make sure we give the front end the same order always
        result = dict(sorted(result.items()))

        return result

    @staticmethod
    def filter_on_key(dicto: dict, key: str = None, value: str | float | int = None) -> bool:
        if dicto[key] == value:
            return True
        else:
            return False

    @staticmethod
    def sum_values(group: str, group_members: list, want_to_know: dict) -> dict:
        return {
            group: {
                wkey: sum([float(member[wvalue]) for member in group_members if member[""]])
                for wkey, wvalue in want_to_know.items()
            }
        }
