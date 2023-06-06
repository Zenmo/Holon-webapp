import itertools
import traceback
from typing import Iterator
from holon.models.interactive_element import (
    InteractiveElement,
)

from holon.models.scenario import Scenario
from holon.cache.cache_runner.config import Config

from holon.serializers.interactive_element import InteractiveElementInput

from main.pages.casus import CasusPage
from main.pages.storyline import StorylinePage
from main.pages.challengemode import ChallengeModePage
from main.blocks.storyline_section import InteractiveInputBlock, StorylineSectionBlock
from main.pages.base_storyline_challengemode import BaseStorylineChallengeMode

from typing import Type


def get_holon_input_combinations(
    scenario: Scenario, include_storyline: bool = True, include_challenge: bool = True
) -> tuple[Iterator[tuple[InteractiveElementInput]], int]:
    """Return a HolonInputConfigurationGenerator which can return all possible combinations of input options for each interactive element for a challange in a scenario"""
    try:
        casus_page = CasusPage.objects.filter(scenario=scenario).first()

        Config.logger.log_print(
            f"Computing input combinations for scenario {scenario} ({scenario.id})"
        )

        casus_combinations_iterators = []
        challenge_combinations_iterators = []
        n_casus_combinations = 0
        n_challenge_combinations = 0

        if include_storyline:
            (
                casus_combinations_iterators,
                n_casus_combinations,
            ) = get_holon_input_combinations_per_page(casus_page, StorylinePage)

        if include_challenge:
            (
                challenge_combinations_iterators,
                n_challenge_combinations,
            ) = get_holon_input_combinations_per_page(casus_page, ChallengeModePage)

        return (
            itertools.chain.from_iterable(
                casus_combinations_iterators + challenge_combinations_iterators
            ),
            n_casus_combinations + n_challenge_combinations,
        )

    except CasusPage.DoesNotExist:
        Config.logger.log_print(f"No CasusPage found for scenario {scenario} with id {scenario.id}")
        return ([], 0)
    except Exception as e:
        Config.logger.log_print(f"Error while computing combinations: {e}")
        print(traceback.format_exc())
        return ([], 0)


def get_holon_input_combinations_per_page(
    casus_page: CasusPage, page_type: Type[BaseStorylineChallengeMode]
) -> tuple[list[Iterator[tuple[InteractiveElementInput]]], int]:
    """Return a HolonInputConfigurationGenerator which can return all possible combinations of input options for a specific type of casuspage"""

    Config.logger.log_print(
        f"Computing input combinations for casus page {casus_page.id} and page type {page_type.__name__}"
    )

    interative_input_blocks_per_section = get_interactive_input_blocks_per_section(
        casus_page, page_type
    )

    iterators, n_combinations = generate_interactive_input_combinations(
        interative_input_blocks_per_section
    )

    return iterators, n_combinations


def get_interactive_input_blocks_per_section(
    casus_page: CasusPage, page_type: Type[BaseStorylineChallengeMode] = StorylinePage
) -> list[list[InteractiveInputBlock]]:
    """Return a list of sections containing a list of interactive inputs for a on the casuspage"""

    try:
        page_with_interactive_inputs: page_type = page_type.objects.descendant_of(
            casus_page
        ).first()

        if page_with_interactive_inputs is None:
            Config.logger.log_print(
                f"No {page_type.__name__} found for for casuspage {casus_page} with id {casus_page.id}"
            )
            return []

        sections: list[StorylineSectionBlock] = [
            block
            for block in page_with_interactive_inputs.storyline
            if type(block.block) == StorylineSectionBlock
        ]
        interative_input_blocks_per_section = [
            [
                dict(block.value)
                for block in section.value["content"]
                if type(block.block) == InteractiveInputBlock
            ]
            for section in sections
        ]
        return interative_input_blocks_per_section

    except Exception as e:
        Config.logger.log_print(
            f"Something went wrong generating interactive input combinations for scenario  {casus_page} with id {casus_page.id}. {e}"
        )
        return []


def generate_interactive_input_combinations(
    sections: list[list[InteractiveInputBlock]],
) -> tuple[list[Iterator[tuple[InteractiveElementInput]]], int]:
    """Return a list of generators which can return all possible combinations of input options for each interactive element for the given sections. Also returns the total number of combinations"""

    iterators: list(Iterator[tuple[InteractiveElementInput]]) = []
    target_value_blocks: dict[int, InteractiveInputBlock] = {}

    total_combinations = 0

    for section in sections:

        print(f" - Section with {len(section)} interactive elements")

        section_combinations = 1

        interactive_element_input_lists: dict[int, list[InteractiveElementInput]] = {}

        # Set target values if from previous sections
        for interactive_element_id, interactive_input_block in target_value_blocks.items():
            interactive_element_input_lists[interactive_element_id] = [
                InteractiveElementInput(
                    interactive_input_block["interactive_input"],
                    interactive_input_block["target_value"],
                )
            ]

        for interactive_input_block in section:
            interactive_element: InteractiveElement = interactive_input_block["interactive_input"]

            if not interactive_input_block["visible"]:
                interactive_element_input_lists[interactive_element.id] = [
                    InteractiveElementInput(
                        interactive_element,
                        interactive_input_block["default_value"],
                    )
                ]
                print(
                    f"   - Invisible interactive element \"{interactive_element}\", default value {interactive_input_block['default_value']}"
                )

            else:
                interactive_element_input_lists[interactive_element.id] = [
                    InteractiveElementInput(interactive_element, value)
                    for value in interactive_element.get_possible_values()
                ]

                print(
                    f'   - Interactive element "{interactive_element}" with {len(interactive_element_input_lists[interactive_element.id])} possible input values'
                )
                section_combinations *= len(interactive_element_input_lists[interactive_element.id])

            # Update targets
            if interactive_input_block["target_value"]:
                target_value_blocks[interactive_element.id] = interactive_input_block

        print(f"  - Section adds {section_combinations} possible combinations")
        total_combinations += section_combinations

        # Put all combinations in iterator list
        interactive_element_input_lists = interactive_element_input_lists.values()
        iterators.append(itertools.product(*interactive_element_input_lists))

    return iterators, total_combinations
