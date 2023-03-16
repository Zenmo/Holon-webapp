# start class script
import json
from functools import partial
from typing import Union


def dprint(d: dict) -> None:
    print(json.dumps(d, indent=2))


class CostBenedict:
    """it's not the egg it claims to be"""

    ## HARDCODED for now ;)
    WANT_TO_KNOW = {
        "Energieleverancier": "balanceElectricityDelivery_eur",
        "Netbeheerder": "balanceElectricityTransport_eur",
        "Overheid": "balanceElectricityTax_eur",
    }
    # not existing key; just for fun (only the slash is meaningful for later use)
    NEK = "h4ck3rm4n69_was_here/"

    def __init__(self, actors: list) -> None:
        self.actors = actors

        self.want_to_know = self.WANT_TO_KNOW

        # update the want to know with the holon actor group name (nice name) and a key
        # that we are very sure of that it does not exist ;)
        for actor in actors:
            if "hol" in actor["actorID"]:
                self.want_to_know.update({actor["group"]: self.NEK + actor["actorID"]})

    def determine_group_costs(self):
        return self.determine_cost(groupby="group", want_to_know=self.want_to_know)

    def determine_cost(self, groupby: str, want_to_know: dict):
        direct_transactions = {}
        groups = set()
        for actor in self.actors:
            if actor[groupby]:
                groups.add(actor[groupby])

        for group in groups:
            filter_on_groupby = partial(self.filter_on_key, key=groupby, value=group)
            group_members = list(filter(filter_on_groupby, self.actors))

            direct_transactions.update(
                self.sum_values(group=group, group_members=group_members, want_to_know=want_to_know)
            )

        ## This can be implemented cleverly with filters and maps I think, but not now
        # obtain inverse transactions
        inverse_transactions = {}
        for party, transactions in direct_transactions.items():
            for receiving_party, value in transactions.items():
                try:
                    inverse_transactions[receiving_party][party]
                except KeyError:
                    try:
                        inverse_transactions[receiving_party]
                        inverse_transactions[receiving_party].update({party: 0})
                    except KeyError:
                        inverse_transactions.update({receiving_party: {}})
                        inverse_transactions[receiving_party].update({party: 0})
                finally:
                    inverse_transactions[receiving_party][party] -= value
        
        # merge dicts
        for party, transactions in inverse_transactions.items():
            try:
                direct_transactions[party].update(transactions)
            except KeyError:
                direct_transactions.update({party: {}})
                direct_transactions[party].update(transactions)

        # round all transactions
        for party, transactions in direct_transactions.items():
            for party, transaction in transactions.items():
                transactions[party] = round(transaction)

        # sort to make sure we give the front end the same order always
        return dict(sorted(direct_transactions.items()))

    @staticmethod
    def filter_on_key(dicto: dict, key: str = None, value: Union[str, float, int] = None) -> bool:
        if dicto[key] == value:
            return True
        else:
            return False

    def sum_values(self, group: str, group_members: list, want_to_know: dict) -> dict:
        """based on the configuration sum differently"""
        # TODO assumes based on parentholon property (acutally quite a nice solution)

        group_sum = {key: 0 for key in want_to_know.keys()}

        for member in group_members:
            if member["parentHolon"] is not None:
                for key in group_sum.keys():
                    try:
                        holon_id = want_to_know[key].split("/")[1]
                        if member["parentHolon"] == holon_id:
                            group_sum[key] += sum(
                                [
                                    float(member[value]) if self.NEK not in value else 0
                                    for value in want_to_know.values()
                                ]
                            )
                    except IndexError:
                        pass

            else:
                for key in group_sum.keys():
                    try:
                        group_sum[key] += float(member[want_to_know[key]])
                    except KeyError:
                        pass

        return {group: group_sum}
