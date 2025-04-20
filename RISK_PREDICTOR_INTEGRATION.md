# Risk Predictor Integration

This document explains how the Risk Predictor has been integrated with the Brain Hack application.

## Overview

The integration consists of two main components:

1. **Flask Backend**: A Python Flask application that loads the trained model and provides an API endpoint for making predictions.
2. **Next.js Frontend**: The Brain Hack frontend application that calls the Flask API to get predictions.

## Changes Made

### Flask Backend

1. Added CORS support to allow cross-origin requests from the Next.js frontend.
2. Modified the Flask app to look for templates in the project root's templates directory.
3. Updated the Flask app to look for the .pkl model files in the project root directory.

### Next.js Frontend

1. Updated the risk-predictor/page.tsx component to match the Flask backend's requirements:
   - Added all the form fields required by the Flask backend (time_of_day_hour, day_of_week, location, etc.)
   - Changed the form submission to use FormData instead of JSON
   - Updated the response handling to use risk_percentage, recommendation, and alternative fields
   - Added a risk meter visualization similar to the one in the index.html template
   - Added a focus timer section that appears after getting a prediction

## How to Run

### 1. Start the Flask Backend

1. Navigate to the flask_app directory:
   ```
   cd flask_app
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the Flask application:
   ```
   python app.py
   ```

   The API will be available at `http://localhost:5000`.

### 2. Start the Next.js Frontend

1. Navigate to the project root directory:
   ```
   cd ..
   ```

2. Install dependencies (if not already done):
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

   The application will be available at `http://localhost:9002`.

## How It Works

1. When a user submits the form on the Risk Predictor page, the frontend sends the data to the Flask API.
2. The Flask API processes the data, uses the trained model to make a prediction, and returns the prediction along with personalized recommendations.
3. The frontend displays the prediction and recommendations to the user.

## Troubleshooting

- If you see an error message about not being able to connect to the prediction server, make sure:
  1. The Flask application is running at `http://localhost:5000`
  2. CORS is properly configured in the Flask app to allow requests from `http://localhost:9002`
  3. Your browser isn't blocking cross-origin requests
  4. There are no network issues preventing the connection
- If the model is not loading correctly, check that the model files (distraction_model.pkl and feature_columns.pkl) are in the project root directory.
- If the templates are not loading correctly, check that the index.html file is in the templates directory at the project root.

## Recent Fixes

The following issues have been fixed in the latest update:

1. CORS configuration in the Flask backend has been updated to explicitly allow requests from the frontend running on port 9002.
2. The fetch request in the frontend has been updated to include proper CORS and credential settings.
3. Documentation has been updated to correctly state that the frontend runs on port 9002.
