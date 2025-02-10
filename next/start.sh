#!/bin/bash

# Build and start the containers
docker-compose up --build -d

# Wait for the database to be ready (handled by healthcheck in docker-compose)
echo "Waiting for services to start..."
sleep 10

# Initialize the database
docker-compose exec app yarn init-db

echo "Application is running at http://localhost:3000" 