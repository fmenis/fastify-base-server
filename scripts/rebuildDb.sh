# /bin/bash

echo "==============================="
echo " Rebuild postgres database "
echo "==============================="

echo "Stop postgres container"
docker container stop postgres-fastify
docker container stop postgres-fastify-test

echo "Remove postgres container"
docker container rm postgres-fastify
docker container rm postgres-fastify-test

echo "Remove postgres data (volume)"
docker volume rm postgres-fastify
docker volume rm postgres-fastify-test

echo "Relaunch stack"
docker-compose up  -d