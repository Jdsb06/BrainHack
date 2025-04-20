# app.py
from flask import Flask, request, jsonify, render_template
import pandas as pd
import pickle
import numpy as np
from flask_cors import CORS
import os

# Set up the template folder path to point to the templates directory in the flask_app directory
template_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
app = Flask(__name__, template_folder=template_dir)
# Enable CORS for all routes with specific settings for the frontend
# Get allowed origins from environment variable or use a default list
allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'http://localhost:9002,http://localhost:3000')
origins_list = allowed_origins.split(',')
CORS(app, resources={r"/*": {"origins": origins_list, "supports_credentials": True}})

# Set up paths to the model and feature columns files
model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'distraction_model.pkl')
feature_columns_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'feature_columns.pkl')

# Load the model
# Note: There might be a warning about loading a serialized XGBoost model from an older version
# If you encounter issues, consider exporting the model using Booster.save_model and then loading it
try:
    # Try to load the model using a more compatible approach for XGBoost
    import xgboost as xgb
    if os.path.exists(model_path):
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        print("Model loaded successfully")

        # If this is an XGBoost model and we want to avoid the serialization warning,
        # we could save and reload it using XGBoost's native format
        # Uncomment the following lines if you want to convert the model
        """
        if isinstance(model, xgb.Booster) or hasattr(model, 'get_booster'):
            # Get the booster if it's a scikit-learn wrapper
            booster = model.get_booster() if hasattr(model, 'get_booster') else model
            # Save in XGBoost format
            temp_model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'temp_model.json')
            booster.save_model(temp_model_path)
            # Load back
            new_model = xgb.Booster()
            new_model.load_model(temp_model_path)
            # Replace the original model
            model = new_model
            # Clean up
            os.remove(temp_model_path)
            print("Model converted to XGBoost native format")
        """
    else:
        raise FileNotFoundError(f"Model file not found at {model_path}")
except Exception as e:
    print(f"Error loading model: {e}")
    raise

# Load the feature columns
try:
    with open(feature_columns_path, 'rb') as f:
        feature_columns = pickle.load(f)
    print("Feature columns loaded successfully")
except Exception as e:
    print(f"Error loading feature columns: {e}")
    raise


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ask-brainhack')
def ask_brainhack():
    return render_template('ask_brainhack.html')


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
            # Add missing categorical columns with the default value 'unknown'
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
    # Get port from the environment variable or use default 5000
    port = int(os.environ.get('FLASK_PORT', 5000))
    # In production, set debug to False
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'

    # Try to run the app, if port is in use, try the next port
    max_attempts = 10
    for attempt in range(max_attempts):
        try:
            app.run(host='0.0.0.0', port=port, debug=debug)
            break
        except OSError as e:
            if "Address already in use" in str(e) and attempt < max_attempts - 1:
                print(f"Port {port} is already in use, trying port {port + 1}")
                port += 1
            else:
                raise
