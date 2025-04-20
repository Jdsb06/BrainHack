#!/bin/bash

echo "Testing Docker permissions..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if the docker group exists
if ! getent group docker > /dev/null 2>&1; then
    echo "❌ Error: The docker group does not exist on this system."
    echo "Please run the fix_docker_permissions.sh script to create the docker group and add your user to it:"
    echo "  chmod +x fix_docker_permissions.sh"
    echo "  ./fix_docker_permissions.sh"
    exit 1
fi

# Try to run a simple Docker command
if docker info > /dev/null 2>&1; then
    echo "✅ Success! You have the necessary permissions to use Docker."
    echo "You can now build and run the Docker container:"
    echo "  docker build -t distraction-predictor-api ."
    echo "  docker run -p 8080:8080 distraction-predictor-api"
else
    echo "❌ Error: You don't have permission to use Docker."
    echo "Please run the fix_docker_permissions.sh script:"
    echo "  chmod +x fix_docker_permissions.sh"
    echo "  ./fix_docker_permissions.sh"
    echo ""
    echo "After running the script, log out and log back in, or run:"
    echo "  newgrp docker"
    echo ""
    echo "Alternatively, you can use sudo with Docker commands:"
    echo "  sudo docker build -t distraction-predictor-api ."
    echo "  sudo docker run -p 8080:8080 distraction-predictor-api"
fi
