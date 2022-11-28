#!/bin/bash
# $0 is a script name, $1, $2, $3 etc are passed arguments
# $1 is our command
# Credits: https://rock-it.pl/how-to-write-excellent-dockerfiles/

wait_for_db () {
    # Wait until postgres is ready
    until nc -z $DB_HOST 5432; do
        echo "$(date) - waiting for postgres... ($DB_HOST:5432)"
        sleep 3
    done
}

setup_submodules () {
  cd /workspace/src/holon/services
  cloudclient_init -tf . --get-api-key
}

setup_django () {
    echo Running migrations
    python manage.py migrate --noinput
    
    echo Create dummy user if none exists
    python manage.py create_superuser_if_none_exists --user=admin --password=admin
    
    echo Collecting static-files
    python manage.py collectstatic --noinput

    echo Create cache table
    python manage.py createcachetable
}

load_fixture_data() {
  python manage.py loaddata holon/fixtures/holon-fixture.json
  python manage.py loaddata holon/fixtures/api-fixture.json
}

setup_submodules
wait_for_db
setup_django
load_fixture_data

echo Starting using gunicorn
exec gunicorn pipit.wsgi:application --bind 0.0.0.0:8000 --workers 3
