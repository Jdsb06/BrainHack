# app.py
from flask import Flask, request, jsonify, render_template
import pandas as pd
import pickle
import numpy as np

app = Flask(__name__)

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
    # Get data from form
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


if __name__ == '__main__':
    app.run(debug=True)
