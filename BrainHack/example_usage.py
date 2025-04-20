"""
Example script demonstrating how to use the DistractionPredictor class
in another Python project.

To run this example:
python example_usage.py
"""

from predictor import DistractionPredictor

def main():
    # Initialize the predictor
    predictor = DistractionPredictor()
    
    print("BrainHack Distraction Predictor Example\n")
    
    # Example 1: Basic prediction with a dictionary
    print("Example 1: Basic prediction")
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
    
    print("\n" + "-"*50 + "\n")
    
    # Example 2: Using with different data
    print("Example 2: Different scenario")
    data2 = {
        'time_of_day': '22:00',
        'day_of_week': 'Friday',
        'location': 'home',
        'current_activity': 'relaxing',
        'phone_battery_level': 30,
        'notifications_last_hour': 12,
        'screen_time_today_minutes': 240,
        'stress_level': 2,
        'sleep_hours_last_night': 8
    }
    
    result2 = predictor.predict_with_recommendations(data2)
    print(f"Risk percentage: {result2['risk_percentage']}%")
    print(f"Recommendation: {result2['recommendation']}")
    print(f"Alternative: {result2['alternative']}")
    
    print("\n" + "-"*50 + "\n")
    
    # Example 3: Handling missing data
    print("Example 3: With missing data")
    incomplete_data = {
        'time_of_day': '10:15',
        'day_of_week': 'Wednesday',
        # 'location' is missing
        'current_activity': 'studying',
        'phone_battery_level': 90,
        # 'notifications_last_hour' is missing
        'screen_time_today_minutes': 45,
        'stress_level': 4,
        'sleep_hours_last_night': 6
    }
    
    result3 = predictor.predict_with_recommendations(incomplete_data)
    print(f"Risk percentage: {result3['risk_percentage']}%")
    print(f"Recommendation: {result3['recommendation']}")
    print(f"Alternative: {result3['alternative']}")
    
    print("\nNote: Missing features were automatically handled with default values.")
    
if __name__ == "__main__":
    main()