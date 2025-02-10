#!/bin/bash

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Create necessary directories
sudo mkdir -p /var/lib/mysql-data
sudo mkdir -p /var/lib/dicom-files

# Set proper permissions
sudo chmod -R 755 /var/lib/mysql-data
sudo chmod -R 755 /var/lib/dicom-files

# Pull the latest code (assuming you're using git)
git pull origin main

# Build and start the containers
docker-compose -f docker-compose-prod.yml up --build -d

# Initialize the database (only first time)
sleep 10
docker-compose -f docker-compose-prod.yml exec app yarn init-db

# Create .env file
cat > .env << EOL
MYSQL_ROOT_PASSWORD=dicom_password
MYSQL_PASSWORD=dicom_password
DB_PORT=3306
DB_NAME=dicom_db
DB_USER=dicom_user
DB_PASS=dicom_password
EOL

# Set proper permissions
chmod 600 .env

echo "Deployment completed!" 