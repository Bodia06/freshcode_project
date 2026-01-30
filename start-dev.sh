#!/usr/bin/env bash

started_at=$(date +"%s")

echo "-----> Provisioning containers"

docker compose --file docker-compose-dev.yaml up -d 

echo "Waiting for services to be ready..."
sleep 5

echo ""

echo "-----> Running application migrations"

docker compose --file docker-compose-dev.yaml exec server-dev npx sequelize-cli db:migrate
echo ""

echo "-----> Running application seeds"
docker compose --file docker-compose-dev.yaml exec server-dev npx sequelize-cli db:seed:all
echo "<----- Seeds created"

ended_at=$(date +"%s")
minutes=$(((ended_at - started_at) / 60))
seconds=$(((ended_at - started_at) % 60))

echo "-----> Done in ${minutes}m${seconds}s"