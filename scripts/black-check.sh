# Run Python style checker
black --line-length 100 --exclude "^.*\b(migrations)\b.*$" "$( dirname "$0"; )/../src/"

