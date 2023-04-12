docker compose stop
echo y | docker compose rm
echo y | docker volume rm $(docker volume ls -q | grep -v dev)
docker compose up -d