import requests

# Simulate form data from the HTML form
form_data = {
    'time_of_day_hour': '14',
    'day_of_week': 'Mon',
    'location': 'home',
    'current_activity': 'studying',
    'productive_session_duration_minutes': '60',
    'time_since_productive_activity_minutes': '10',
    'stress_level': '3',
    'fatigue_level': '2',
    'notifications_last_30min': '5',
    'phone_unlocks_last_hour': '3'
}

# Send a POST request to the /predict endpoint
try:
    response = requests.post('http://127.0.0.1:5000/predict', data=form_data)
    
    # Check if the request was successful
    if response.status_code == 200:
        print("Request successful!")
        print("Response:", response.json())
    else:
        print(f"Request failed with status code {response.status_code}")
        print("Response:", response.text)
except Exception as e:
    print(f"Error: {e}")