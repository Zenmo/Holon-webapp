#! /bin/bash -
PROGNAME=$0

usage() {
  cat << EOF >&2
Usage: $PROGNAME [-i <scenario_ids>] [-c <include_challenge>] [-s <include_storyline>]

 -i <scenario_ids> (comma seperated ints): ...
 -c <include_challenge> (bool in Python format): ...
 -s <include_storyline> (bool in Python format): ...
EOF
  exit 1
}

scenario_ids=() challenge="True" storyline="True"
while getopts i:s:c: o; do
  case $o in
    (i) scenario_ids+=$OPTARG;;
    (c) challenge=$OPTARG;;
    (s) storyline=$OPTARG;;
    (*) usage
  esac
done
shift "$((OPTIND - 1))"

echo "Running:
    from holon.cache.cache_runner import cache_runner
    cache_runner.update_cache(
        scenario_ids=[$scenario_ids],
        include_storyline=$storyline,
        include_challenge=$challenge
    )
"

python manage.py createcachetable
python manage.py shell <<EOF 
from holon.cache.cache_runner import cache_runner
cache_runner.update_cache(
    scenario_ids=[$scenario_ids],
    include_storyline=$storyline,
    include_challenge=$challenge
)
EOF