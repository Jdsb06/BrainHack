#!/bin/bash
# Script to deploy the BrainHack application to Heroku

echo "Preparing to deploy BrainHack to Heroku..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "Heroku CLI is not installed. Please install it first:"
    echo "https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged in to Heroku
heroku whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "Please log in to Heroku first:"
    heroku login
fi

# Create Procfile if it doesn't exist
if [ ! -f "Procfile" ]; then
    echo "Creating Procfile..."
    echo "web: gunicorn app:app" > Procfile
    echo "Procfile created."
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

# Create or update runtime.txt
echo "Creating runtime.txt..."
echo "python-3.9.7" > runtime.txt
echo "runtime.txt created."

# Create a new Heroku app or use existing one
read -p "Do you want to create a new Heroku app? (y/n): " create_new
if [ "$create_new" = "y" ]; then
    read -p "Enter app name (leave blank for random name): " app_name
    if [ -z "$app_name" ]; then
        heroku create
    else
        heroku create "$app_name"
    fi
else
    read -p "Enter existing Heroku app name: " app_name
    heroku git:remote -a "$app_name"
fi

# Add Heroku remote if not already added
if ! git remote | grep -q "heroku"; then
    echo "Adding Heroku remote..."
    heroku git:remote -a "$app_name"
fi

# Commit any changes
git add .
git commit -m "Prepare for Heroku deployment"

# Push to Heroku
echo "Deploying to Heroku..."
git push heroku main

# Open the app in browser
echo "Deployment complete! Opening app in browser..."
heroku open

echo "Your BrainHack app is now deployed to Heroku!"
echo "API URL: https://$app_name.herokuapp.com/predict"
echo "Remember to update your Firebase frontend to use this URL for predictions."