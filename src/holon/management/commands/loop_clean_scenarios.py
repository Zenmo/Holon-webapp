from time import sleep

from django.core.management.base import BaseCommand, CommandError

from holon.models import Scenario


# Run using `python manage.py loop_clean_scenarios`
class Command(BaseCommand):
    help = (
        "Using Holontool creates clones of scenarios."
        "These clones are no longer needed after usage."
        "This removes those from the database."
    )

    def handle(self, *args, **options):
        # No error handling: error is propagated to supervisor
        while True:
            # Improvement: remove only scenarios which are old enough not to be in use
            cloned_scenarios = Scenario.objects.filter(cloned_from__isnull=False)
            for scenario in cloned_scenarios:
                print(f"Deleting scenario {scenario.id}...")
                cid = scenario.id
                scenario.delete()
                print(f"... deleted scenario {cid}")

            sleep(60 * 60)
