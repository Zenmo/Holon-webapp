echo "running 'python manage.py $@' in python container..."
docker compose exec python python manage.py $@

