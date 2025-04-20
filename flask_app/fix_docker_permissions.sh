#!/bin/bash

echo "This script will fix Docker permission issues by adding your user to the docker group."
echo "You will need to enter your password for sudo commands."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if the docker group exists
if ! getent group docker > /dev/null 2>&1; then
    echo "The docker group does not exist. Creating it now..."
    sudo groupadd docker
    echo "Docker group created successfully."
fi

# Add the current user to the docker group
echo "Adding user $(whoami) to the docker group..."
sudo usermod -aG docker $USER

echo ""
echo "User $(whoami) has been added to the docker group."
echo "IMPORTANT: You need to log out and log back in for the changes to take effect."
echo "Alternatively, you can run the following command to apply the changes to the current session:"
echo "  newgrp docker"
echo ""
echo "To verify that the fix worked, run:"
echo "  docker info"
echo ""
echo "If you still see permission errors, you can use the temporary fix:"
echo "  sudo chmod 666 /var/run/docker.sock"
echo "Or use sudo with Docker commands:"
echo "  sudo docker build -t distraction-predictor-api ."
echo "  sudo docker run -p 8080:8080 distraction-predictor-api"
