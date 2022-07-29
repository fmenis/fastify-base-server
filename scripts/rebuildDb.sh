# /bin/bash

echo "==============================="
echo " Rebuild postgres database "
echo "==============================="

echo "Stop postgres container"
docker container stop postgres-fastify

echo "Remove postgres container"
docker container rm postgres-fastify

echo "Remove postgres data (volume)"
docker volume rm postgres-fastify

echo "Relaunch stack"
docker-compose up  -d