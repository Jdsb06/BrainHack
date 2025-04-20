import pandas as pd
import pickle
import os

class DistractionPredictor:
    """
    A class for making distraction predictions using the trained model.
    This class can be imported and used in other projects.
    """
    
    def __init__(self, model_path='distraction_model.pkl', feature_columns_path='feature_columns.pkl'):
        """
        Initialize the predictor with the trained model and feature columns.
        
        Args:
            model_path (str): Path to the trained model pickle file
            feature_columns_path (str): Path to the feature columns pickle file
        """
        # Get the absolute path if relative paths are provided
        if not os.path.isabs(model_path):
            model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), model_path)
        
        if not os.path.isabs(feature_columns_path):
            feature_columns_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), feature_columns_path)
        
        # Load the model
        with open(model_path, 'rb') as f:
            self.model = pickle.load(f)
        
        # Load the feature columns
        with open(feature_columns_path, 'rb') as f:
            self.feature_columns = pickle.load(f)
    
    def prepare_input(self, data):
        """
        Prepare the input data for prediction.
        
        Args:
            data (dict or pandas.DataFrame): Input data for prediction
            
        Returns:
            pandas.DataFrame: Prepared input data
        """
        # Convert dict to DataFrame if necessary
        if isinstance(data, dict):
            input_df = pd.DataFrame([data])
        else:
            input_df = data.copy()
        
        # Ensure all required numeric columns exist
        for col in self.feature_columns['numeric']:
            if col in input_df.columns:
                input_df[col] = input_df[col].astype(float)
            else:
                # Add missing numeric columns with default value 0
                input_df[col] = 0
        
        # Ensure all required categorical columns exist
        for col in self.feature_columns['categorical']:
            if col not in input_df.columns:
                # Add missing categorical columns with default value 'unknown'
                input_df[col] = 'unknown'
        
        return input_df
    
    def predict(self, data):
        """
        Make a prediction using the trained model.
        
        Args:
            data (dict or pandas.DataFrame): Input data for prediction
            
        Returns:
            float: Probability of distraction (0-1)
        """
        # Prepare the input data
        input_df = self.prepare_input(data)
        
        # Make prediction
        prediction = float(self.model.predict_proba(input_df)[0, 1])
        
        return prediction
    
    def predict_with_recommendations(self, data):
        """
        Make a prediction and generate recommendations based on the risk level.
        
        Args:
            data (dict or pandas.DataFrame): Input data for prediction
            
        Returns:
            dict: Dictionary containing risk_percentage, recommendation, and alternative
        """
        # Get the prediction
        prediction = self.predict(data)
        
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
        
        return {
            'risk_percentage': risk_percentage,
            'recommendation': recommendation,
            'alternative': alternative
        }