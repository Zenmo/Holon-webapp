# Just a little convience script for the lazy (and gives some certainty with regards to the fixture)
set -eux
fixture='latest-datamodel-mvp-fixture.json'

# Migrate and apply
python manage.py makemigrations
python manage.py migrate

# make fixture
python manage.py dumpdata --natural-primary --natural-foreign holon > $fixture
# load fixture just to be sure
python manage.py loaddata $fixture