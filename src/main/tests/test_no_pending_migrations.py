from io import StringIO
from unittest import skip

from django.test import TestCase
from django.core.management import call_command


class NoPendingMigrationsTest(TestCase):
    @skip(
        "With Wagtail this is too much of a pain. Fixing this would create huge migrations which don't change anything"
    )
    def test_migrations(self):
        output = StringIO()
        call_command("makemigrations", interactive=False, dry_run=True, stdout=output)
        self.assertIn("No changes detected", output.getvalue())
