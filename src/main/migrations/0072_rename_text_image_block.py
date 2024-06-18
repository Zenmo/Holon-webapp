from datetime import datetime

from django.db import migrations
from wagtail.blocks.migrations.migrate_operation import MigrateStreamData
from wagtail.blocks.migrations.operations import RenameStreamChildrenOperation
import main.blocks.holon_header_image_chooser
import main.blocks.legend_item
import main.blocks.page_chooser_block
import main.blocks.rich_text_block
import wagtail.embeds.blocks
import wagtail.fields
import wagtailmodelchooser.blocks



class Migration(migrations.Migration):
    """
    Rename text_and_media to text_image_block to align with the frontend
    and with the other entities.
    """

    dependencies = [
        ("main", "0071_rename_hero_block"),
    ]

    operations = [
        MigrateStreamData(
            app_name="main",
            model_name="ChallengeModePage",
            field_name="storyline",
            operations_and_block_paths=[
                (RenameStreamChildrenOperation(old_name="text_and_media", new_name="text_image_block"), ""),
            ]
        ),
        MigrateStreamData(
            app_name="main",
            model_name="StorylinePage",
            field_name="storyline",
            operations_and_block_paths=[
                (RenameStreamChildrenOperation(old_name="text_and_media", new_name="text_image_block"), ""),
            ]
        ),
        MigrateStreamData(
            app_name="main",
            model_name="SandboxPage",
            field_name="storyline",
            revisions_from=datetime.fromisoformat('2024-01-01'),
            operations_and_block_paths=[
                (RenameStreamChildrenOperation(old_name="text_and_media", new_name="text_image_block"), ""),
            ]
        ),
    ]
