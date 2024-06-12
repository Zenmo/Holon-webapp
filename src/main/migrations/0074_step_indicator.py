
import uuid

from django.db import migrations
from wagtail.blocks import StreamValue, StructBlock

from main.pages import StorylinePage


def wrap_storyline_sections_in_steps(apps, schema_editor):
    storylinePages: list[StorylinePage] = apps.get_model("main", "StorylinePage").objects.all()
    for page in storylinePages:
        blocks: StreamValue = page.storyline
        step_and_section_blocks = StreamValue(
            StorylinePage.storyline.field.stream_block.child_blocks["step_indicator"],
            [])

        new_blocks = StreamValue(StorylinePage.storyline.field.stream_block, [])

        i = 0
        for block in blocks:
            block: StructBlock
            if block.block_type == "section":
                step_and_section_blocks.append({
                    "type_name": "step_anchor",
                    "value": f"Stap {++i}",
                    "block_id": str(uuid.uuid4()),
                }.values())
                step_and_section_blocks.append(block)
            else:
                new_blocks.append(block)

        new_blocks.append({
            "type_name": "step_indicator",
            "value": step_and_section_blocks,
            "block_id": str(uuid.uuid4()),
        }.values())

        page.storyline = new_blocks
        page.save()


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0073_alter_challengemodepage_storyline_and_more"),
    ]

    operations = [
        migrations.RunPython(
            wrap_storyline_sections_in_steps,
        ),
    ]
