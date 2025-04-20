   # Using BrainHack's Distraction Predictor in Your Project

This guide explains how to use the BrainHack distraction prediction functionality in your own Python project.

## Installation

1. Copy the following files from the BrainHack project to your project:
   - `predictor.py` - The main module containing the DistractionPredictor class
   - `distraction_model.pkl` - The trained machine learning model
   - `feature_columns.pkl` - Information about the feature columns used by the model

2. Make sure you have the required dependencies installed:
   ```bash
   pip install pandas scikit-learn xgboost
   ```

## Basic Usage

Here's a simple example of how to use the DistractionPredictor class in your code:

```python
from predictor import DistractionPredictor

# Initialize the predictor
predictor = DistractionPredictor()

# Example input data
data = {
    'time_of_day': '15:30',
    'day_of_week': 'Monday',
    'location': 'home',
    'current_activity': 'working',
    'phone_battery_level': 75,
    'notifications_last_hour': 5,
    'screen_time_today_minutes': 120,
    'stress_level': 3,
    'sleep_hours_last_night': 7
}

# Get a simple prediction (probability of distraction)
probability = predictor.predict(data)
print(f"Probability of distraction: {probability:.2f}")

# Get prediction with recommendations
result = predictor.predict_with_recommendations(data)
print(f"Risk percentage: {result['risk_percentage']}%")
print(f"Recommendation: {result['recommendation']}")
print(f"Alternative: {result['alternative']}")
```

## Advanced Usage

### Using Custom Model Paths

If you store the model files in a different location, you can specify the paths when initializing the predictor:

```python
predictor = DistractionPredictor(
    model_path='/path/to/your/distraction_model.pkl',
    feature_columns_path='/path/to/your/feature_columns.pkl'
)
```

### Batch Predictions

You can also make predictions on multiple data points at once using a pandas DataFrame:

```python
import pandas as pd

# Create a DataFrame with multiple rows
data = pd.DataFrame([
    {
        'time_of_day': '15:30',
        'day_of_week': 'Monday',
        'location': 'home',
        'current_activity': 'working',
        'phone_battery_level': 75,
        'notifications_last_hour': 5,
        'screen_time_today_minutes': 120,
        'stress_level': 3,
        'sleep_hours_last_night': 7
    },
    {
        'time_of_day': '20:00',
        'day_of_week': 'Friday',
        'location': 'home',
        'current_activity': 'relaxing',
        'phone_battery_level': 50,
        'notifications_last_hour': 10,
        'screen_time_today_minutes': 180,
        'stress_level': 2,
        'sleep_hours_last_night': 8
    }
])

# Process each row
for i, row in data.iterrows():
    result = predictor.predict_with_recommendations(row.to_dict())
    print(f"Data point {i+1}: Risk percentage: {result['risk_percentage']}%")
```

## Required Input Features

The model expects the following features:

### Categorical Features
- `time_of_day`: The time of day (e.g., '09:30', '15:45')
- `day_of_week`: The day of the week (e.g., 'Monday', 'Tuesday')
- `location`: Current location (e.g., 'home', 'office', 'commuting')
- `current_activity`: What the user is doing (e.g., 'working', 'studying', 'relaxing')

### Numeric Features
- `phone_battery_level`: Current phone battery level (0-100)
- `notifications_last_hour`: Number of notifications received in the last hour
- `screen_time_today_minutes`: Minutes of screen time already accumulated today
- `stress_level`: Self-reported stress level (1-5)
- `sleep_hours_last_night`: Hours of sleep the previous night

If any features are missing, the predictor will use default values (0 for numeric features and 'unknown' for categorical features).

## Interpreting Results

The `predict()` method returns a probability between 0 and 1, where higher values indicate a higher risk of distraction.

The `predict_with_recommendations()` method returns a dictionary with three keys:
- `risk_percentage`: The probability converted to a percentage (0-100%)
- `recommendation`: A suggestion based on the risk level
- `alternative`: An alternative activity suggestion

## Troubleshooting

If you encounter any issues:

1. Make sure all required dependencies are installed
2. Verify that the model and feature columns files are in the correct location
3. Check that your input data contains the expected features
4. Ensure that numeric features are provided as numbers and categorical features as strings