#!/bin/bash

# Get the container ID of the MySQL container
CONTAINER_ID=$(docker ps -qf "name=mono-repo-dicom-db-1")

if [ -z "$CONTAINER_ID" ]; then
    echo "MySQL container not found. Make sure it's running."
    exit 1
fi

# Execute the reset script
echo "Resetting database..."
docker exec -i $CONTAINER_ID mysql -udicom_user -pdicom_password dicom_db < backend/src/db/scripts/reset.sql

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Database reset successfully!"
else
    echo "Error resetting database."
    exit 1
fi 