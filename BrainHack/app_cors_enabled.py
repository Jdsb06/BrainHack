# app_cors_enabled.py
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS  # Import CORS
import pandas as pd
import pickle
import numpy as np
import os  # Import os for environment variables

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model
with open('distraction_model.pkl', 'rb') as f:
    model = pickle.load(f)

# Load the feature columns
with open('feature_columns.pkl', 'rb') as f:
    feature_columns = pickle.load(f)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from form or JSON
        if request.is_json:
            data = request.json
        else:
            data = request.form.to_dict()

        # Create a DataFrame with one row
        input_df = pd.DataFrame([data])

        # Ensure all required numeric columns exist
        for col in feature_columns['numeric']:
            if col in input_df.columns:
                input_df[col] = input_df[col].astype(float)
            else:
                # Add missing numeric columns with default value 0
                input_df[col] = 0

        # Ensure all required categorical columns exist
        for col in feature_columns['categorical']:
            if col not in input_df.columns:
                # Add missing categorical columns with default value 'unknown'
                input_df[col] = 'unknown'

        # Make prediction
        prediction = float(model.predict_proba(input_df)[0, 1])

        # Format as percentage
        risk_percentage = round(prediction * 100, 2)

        # Generate recommendations based on risk level
        if risk_percentage > 75:
            recommendation = "High risk of distraction. Consider avoiding your phone for the next 15 minutes."
            alternative = "Try a 5-minute walk or deep breathing exercise instead."
        elif risk_percentage > 50:
            recommendation = "Moderate risk of distraction. Be mindful of your phone usage."
            alternative = "Set a timer if you need to use your phone."
        else:
            recommendation = "Low risk of distraction. This is a good time to use your phone if needed."
            alternative = "Remember to stay focused on your primary task."

        return jsonify({
            'risk_percentage': risk_percentage,
            'recommendation': recommendation,
            'alternative': alternative
        })

    except Exception as e:
        # Return error message
        return jsonify({
            'error': str(e),
            'message': 'An error occurred while processing your request.'
        }), 500


# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'The API is running correctly'
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
