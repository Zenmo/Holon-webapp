from typing import Iterable

from django.db import transaction

from holon.models import (
    Scenario,
    EnergyAsset,
    GridNode,
    Contract,
    Actor,
    Policy,
    GridConnection,
)
from holon.models.util import duplicate_model_nomutate
from pipit.sentry import sentry_sdk_trace


@sentry_sdk_trace
def clone_scenario(scenario: Scenario) -> Scenario:
    """Clone scenario and all its relations in a new scenario and save it to the database"""

    with transaction.atomic():
        new_scenario = duplicate_model_nomutate(scenario)
        new_scenario.cloned_from = scenario
        new_scenario.save()

        actor_id_to_new_model_mapping = clone_actors(scenario.actor_set.all(), new_scenario)

        clone_contracts(
            Contract.objects.filter(actor__payload_id=scenario.id),
            actor_id_to_new_model_mapping,
        )

        gridnode_id_to_new_model_mapping = clone_gridnodes(
            scenario.gridnode_set.all(),
            actor_id_to_new_model_mapping,
            new_scenario,
        )

        clone_gridconnections(
            scenario.gridconnection_set.all(),
            actor_id_to_new_model_mapping,
            gridnode_id_to_new_model_mapping,
            new_scenario,
        )

        clone_policies(scenario.policy_set.all(), new_scenario)

        # fetch again to make sure nothing stale is left in the object
        return Scenario.objects.get(id=new_scenario.id)


def clone_actors(actors: Iterable[Actor], new_scenario: Scenario) -> dict[int, Actor]:
    actor_id_to_new_model_mapping = {}
    for actor in actors:
        new_actor = duplicate_model_nomutate(actor)
        new_actor.payload = new_scenario
        new_actor.original_id = actor.id

        actor_id_to_new_model_mapping[actor.id] = new_actor

    Actor.objects.bulk_create(actor_id_to_new_model_mapping.values())

    return actor_id_to_new_model_mapping


def clone_contracts(
    contracts: Iterable[Contract],
    old_actor_id_to_new_model_mapping: dict[int, Actor],
):
    for contract in contracts:
        new_contract = duplicate_model_nomutate(contract)
        new_contract.original_id = contract.id
        new_contract.actor = old_actor_id_to_new_model_mapping[contract.actor_id]
        new_contract.contractScope = old_actor_id_to_new_model_mapping[contract.contractScope_id]
        # Can't bulk create because it's not implemented in django-polymorphic
        new_contract.save()


def clone_gridnodes(
    gridnodes: Iterable[GridNode],
    old_actor_id_to_new_model_mapping: dict[int, Actor],
    new_scenario: Scenario,
) -> dict[int, GridNode]:
    gridnode_id_to_new_model_mapping = {}
    for gridnode in gridnodes:
        new_gridnode = duplicate_model_nomutate(gridnode)
        new_gridnode.original_id = gridnode.id
        new_gridnode.payload = new_scenario
        new_gridnode.owner_actor = old_actor_id_to_new_model_mapping[gridnode.owner_actor_id]
        # Can't bulk create because it's not implemented in django-polymorphic
        new_gridnode.save()

        gridnode_id_to_new_model_mapping[gridnode.id] = new_gridnode

    for gridnode in gridnodes:
        for asset in gridnode.energyasset_set.all():
            new_asset = duplicate_model_nomutate(asset)
            new_asset.original_id = asset.id
            new_asset.gridnode = gridnode_id_to_new_model_mapping[asset.gridnode_id]
            # Can't bulk create because it's not implemented in django-polymorphic
            new_asset.save()

    # Update gridnode parent
    for gridnode in gridnode_id_to_new_model_mapping.values():
        if gridnode.parent:
            gridnode.parent = gridnode_id_to_new_model_mapping[gridnode.parent.id]
            gridnode.save()

    return gridnode_id_to_new_model_mapping


def clone_gridconnections(
    gridconnections: Iterable[GridConnection],
    old_actor_id_to_new_model_mapping: dict[int, Actor],
    old_gridnode_id_to_new_model_mapping: dict[int, GridNode],
    new_scenario: Scenario,
):
    for gridconnection in gridconnections:
        new_gridconnection = duplicate_model_nomutate(gridconnection)
        new_gridconnection.original_id = gridconnection.pk
        new_gridconnection.payload = new_scenario
        new_gridconnection.owner_actor = old_actor_id_to_new_model_mapping[
            gridconnection.owner_actor_id
        ]

        if gridconnection.parent_heat_id:
            new_gridconnection.parent_heat = old_gridnode_id_to_new_model_mapping[
                gridconnection.parent_heat_id
            ]
        if gridconnection.parent_electric_id:
            new_gridconnection.parent_electric = old_gridnode_id_to_new_model_mapping[
                gridconnection.parent_electric_id
            ]

        # Can't bulk create because it's not implemented in django-polymorphic
        new_gridconnection.save()

        clone_gridconnection_assets(gridconnection.energyasset_set.all(), new_gridconnection)


def clone_gridconnection_assets(assets: Iterable[EnergyAsset], new_gridconnection: GridConnection):
    for asset in assets:
        new_asset = duplicate_model_nomutate(asset)
        new_asset.original_id = asset.id
        new_asset.gridconnection = new_gridconnection
        # Can't bulk create because it's not implemented in django-polymorphic
        new_asset.save()


def clone_policies(policies: Iterable[Policy], new_scenario: Scenario):
    new_policies = []
    for policy in policies:
        new_policy = duplicate_model_nomutate(policy)
        new_policy.original_id = policy.id
        new_policy.payload = new_scenario

        new_policies.append(new_policy)

    Policy.objects.bulk_create(new_policies)
