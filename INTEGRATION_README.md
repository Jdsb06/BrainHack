# Risk Predictor Model Integration

This document provides instructions for integrating the trained risk predictor model with the Brain Hack application.

## Overview

The integration consists of two main components:

1. **Flask Backend**: A Python Flask application that loads the trained model and provides an API endpoint for making predictions.
2. **Next.js Frontend**: The existing Brain Hack frontend application that calls the Flask API to get predictions.

## Setup Instructions

### 1. Flask Backend Setup

1. Navigate to the `flask_app` directory:
   ```
   cd flask_app
   ```

2. Place your trained model file (`.pkl` file) in this directory and rename it to `model.pkl`.

3. Create a Python virtual environment (recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Run the Flask application:
   ```
   python app.py
   ```

   The API will be available at `http://localhost:5000`.

### 2. Next.js Frontend

The frontend has already been updated to connect to the Flask API. To run it:

1. Navigate to the root directory of the project.

2. Install dependencies (if not already done):
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

## How It Works

1. When a user submits the form on the Risk Predictor page, the frontend sends the data to the Flask API.
2. The Flask API processes the data, uses the trained model to make a prediction, and returns the prediction along with personalized recommendations.
3. The frontend displays the prediction and recommendations to the user.

## Troubleshooting

- If you see an error message about not being able to connect to the prediction server, make sure the Flask application is running at `http://localhost:5000`.
- If the model is not loading correctly, check that the model file is named `model.pkl` and is placed in the `flask_app` directory.
- If you need to modify how the features are processed or how the prediction is made, update the relevant sections in the `predict()` function in `app.py`.

## Customizing the Model

The current implementation is designed to work with a model that predicts distraction risk based on activity, location, and stress level. If your model requires different inputs or produces different outputs, you'll need to modify:

1. The `predict()` function in `flask_app/app.py` to handle the appropriate inputs and outputs.
2. The form and state variables in `src/app/risk-predictor/page.tsx` to collect and display the appropriate data.