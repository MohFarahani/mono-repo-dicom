#!/bin/bash

# Stop any running containers
docker-compose down

# Remove existing volumes
docker-compose down -v

# Start containers
docker-compose up -d

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
sleep 10

# Initialize database
yarn init-db