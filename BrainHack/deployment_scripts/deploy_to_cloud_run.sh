#!/bin/bash
# Script to deploy the BrainHack application to Google Cloud Run

echo "Preparing to deploy BrainHack to Google Cloud Run..."

# Check if Google Cloud SDK is installed
if ! command -v gcloud &> /dev/null; then
    echo "Google Cloud SDK is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is logged in to Google Cloud
gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"
if [ $? -ne 0 ]; then
    echo "Please log in to Google Cloud first:"
    gcloud auth login
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install it first:"
    echo "https://docs.docker.com/get-docker/"
    exit 1
fi

# Create Dockerfile if it doesn't exist
if [ ! -f "Dockerfile" ]; then
    echo "Creating Dockerfile..."
    cat > Dockerfile << 'EOF'
FROM python:3.9-slim

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

ENV PORT 8080

CMD exec gunicorn --bind :$PORT app:app
EOF
    echo "Dockerfile created."
fi

# Create requirements.txt if it doesn't exist
if [ ! -f "requirements.txt" ]; then
    echo "Creating requirements.txt..."
    pip freeze > requirements.txt
    echo "requirements.txt created."
fi

# Check if gunicorn is in requirements.txt
if ! grep -q "gunicorn" "requirements.txt"; then
    echo "Adding gunicorn to requirements.txt..."
    echo "gunicorn==20.1.0" >> requirements.txt
fi

# Set up Google Cloud project
read -p "Enter your Google Cloud project ID: " project_id
gcloud config set project "$project_id"

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com

# Build and push the Docker image
read -p "Enter a name for your Cloud Run service (default: brainhack): " service_name
service_name=${service_name:-brainhack}

echo "Building and pushing Docker image..."
gcloud builds submit --tag gcr.io/$project_id/$service_name

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy $service_name \
  --image gcr.io/$project_id/$service_name \
  --platform managed \
  --allow-unauthenticated \
  --region us-central1

# Get the service URL
service_url=$(gcloud run services describe $service_name --platform managed --region us-central1 --format="value(status.url)")

echo "Deployment complete!"
echo "Your BrainHack app is now deployed to Google Cloud Run!"
echo "API URL: $service_url/predict"
echo "Remember to update your Firebase frontend to use this URL for predictions."

# Optional: Open the service URL in browser
read -p "Do you want to open the service URL in your browser? (y/n): " open_browser
if [ "$open_browser" = "y" ]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "$service_url"
    elif command -v open &> /dev/null; then
        open "$service_url"
    else
        echo "Could not open browser automatically. Please visit: $service_url"
    fi
fi