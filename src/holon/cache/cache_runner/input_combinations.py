import itertools
import traceback
from typing import Iterator, cast

from wagtail.blocks import StructBlock, StreamBlock, Block, StructValue
from wagtail.blocks.stream_block import StreamValue

StreamChild = StreamValue.StreamChild

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

# import pydevd_pycharm
# pydevd_pycharm.settrace('172.27.0.1', port=9222, stdoutToServer=True, stderrToServer=True)


def get_holon_input_combinations(
    scenario: Scenario, include_storyline: bool = True, include_challenge: bool = True
) -> tuple[Iterator[tuple[InteractiveElementInput]], int]:
    """Return a HolonInputConfigurationGenerator which can return all possible combinations of input options for each interactive element for a challange in a scenario"""
    try:
        casus_page = CasusPage.objects.filter(scenario=scenario).first()
        if casus_page is None:
            Config.logger.log_print(
                f"No CasusPage found for scenario {scenario} with id {scenario.id}"
            )
            return ([], 0)

        Config.logger.log_print(
            f"Computing input combinations for scenario '{scenario}' ({scenario.id})"
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
) -> list[list[StreamValue.StreamChild]]:
    """Return a list of sections containing a list of interactive inputs for a on the casuspage"""

    try:
        pages_with_interactive_inputs = list(page_type.objects.descendant_of(casus_page))

        if len(pages_with_interactive_inputs) == 0:
            Config.logger.log_print(
                f"No {page_type.__name__} found for for casuspage {casus_page} with id {casus_page.id}"
            )
            return []

        blocks: list[StreamValue.StreamChild] = [
            cast(StreamValue.StreamChild, stream_child)
            for page in pages_with_interactive_inputs
            for stream_child in page.storyline
        ]

        top_level_sections: list[StreamValue.StreamChild] = [
            block for block in blocks if type(block.block) == StorylineSectionBlock
        ]

        nested_sections: list[StreamValue.StreamChild] = [
            sub_block
            for block in blocks
            if block.block_type == "step_indicator"
            for sub_block in block.value
            if type(sub_block.block) == StorylineSectionBlock
            # for sub_block in cast(StreamBlock, block).child_blocks.values()
            # if cast(Block, sub_block).name == "section"
        ]

        sections: list[StreamValue.StreamChild] = top_level_sections + nested_sections

        interative_input_blocks_per_section: list[list[StreamValue.StreamChild]] = [
            [
                block
                for block in (cast(StructValue, section.value)["content"])
                # for block in cast(StreamBlock, section.child_blocks["content"]).child_blocks.values()
                if type(block.block) == InteractiveInputBlock
            ]
            for section in sections
        ]
        return interative_input_blocks_per_section

    except Exception as e:
        Config.logger.log_print(
            f"Something went wrong generating interactive input combinations for scenario  {casus_page} with id {casus_page.id}. {e}"
        )
        traceback.print_exception(e)
        return []


def generate_interactive_input_combinations(
    sections: list[list[StreamValue.StreamChild]],
) -> tuple[list[Iterator[tuple[InteractiveElementInput]]], int]:
    """
    Return a list of generators which can return all possible combinations of input options
    for each interactive element for the given sections.
    Also returns the total number of combinations.
    """

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

        for stream_child in section:
            interactive_input_block = stream_child.value
            interactive_element: InteractiveElement = interactive_input_block["interactive_input"]

            # The Interactive Element was could already be in the dict
            # if it was used previously with a target value.
            # We want to always append to the end, so we need to make explicitly remove it from the dict.
            # We want this because the order has to be the same as the order produced by the front-end.
            interactive_element_input_lists.pop(interactive_element.id, None)

            # We abuse "locked" to reduce the number of cache combinations.
            # At the time of writing this is only used in the challenge of case Buurtelektrificatie
            # with the elements "compliance" and "isolatie".
            if not interactive_input_block["visible"] or interactive_input_block["locked"]:
                interactive_element_input_lists[interactive_element.id] = [
                    InteractiveElementInput(
                        interactive_element,
                        interactive_input_block["default_value"],
                    )
                ]

                print(
                    f"   - Invisible or locked interactive element \"{interactive_element}\", default value {interactive_input_block['default_value']}"
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
