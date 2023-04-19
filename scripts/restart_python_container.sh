#!/bin/bash

docker compose stop python
if [[ " $@ " =~ " -nc " ]]; then
    docker-compose build --no-cache python
else
    docker-compose build python
fi
docker compose up -d python