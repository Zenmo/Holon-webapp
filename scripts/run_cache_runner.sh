python manage.py createcachetable
python manage.py shell <<EOF 
from holon.cache.cache_runner import cache_runner
cache_runner.update_cache(scenario_ids=[1, 321001])
EOF