#!/bin/bash

# Set the container name (as defined in the docker-compose file)
CONTAINER_NAME="postgres_container"

# Set PostgreSQL credentials
POSTGRES_USER="admin"
POSTGRES_DB="rampworx"

docker-compose up -d

# Run psql inside the running Docker container
docker exec -it $CONTAINER_NAME psql -U $POSTGRES_USER -d $POSTGRES_DB
