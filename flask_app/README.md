# Risk Predictor Flask API

This is a Flask API for the Risk Predictor model that serves predictions to the Brain Hack frontend application.

## Setup Instructions (Development)

1. Place your trained model file (`.pkl` file) in this directory as `distraction_model.pkl`.

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the Flask application:
   ```
   python app.py
   ```

   The API will be available at `http://localhost:5000`.

## Deployment

For production deployment, see the [Deployment Guide](DEPLOYMENT.md) for detailed instructions on:

- Docker containerization
- Deployment to cloud providers (Google Cloud Run, AWS ECS)
- Traditional deployment with Gunicorn
- Environment configuration
- Security considerations
- Monitoring and scaling

## API Endpoints

### POST /predict

Predicts the distraction risk based on the provided context.

**Request Body:**
Form data with the following fields:
- time_of_day_hour
- day_of_week
- location
- current_activity
- productive_session_duration_minutes
- time_since_productive_activity_minutes
- stress_level
- and other relevant fields as defined in the model

**Response:**
```json
{
  "risk_percentage": 45.5,
  "recommendation": "Moderate risk of distraction. Be mindful of your phone usage.",
  "alternative": "Set a timer if you need to use your phone."
}
```

## Model Integration

The Flask application uses a trained XGBoost model saved as a pickle file (`distraction_model.pkl`). The model makes predictions based on various inputs like time of day, day of week, location, current activity, etc.

If you need to modify how the features are processed or how the prediction is made, update the relevant sections in the `predict()` function in `app.py`.

## Environment Variables

- `FLASK_ENV`: Set to `development` for development mode, `production` for production
- `FLASK_PORT`: The port on which the application will run (default: 5000)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

## Troubleshooting

### Docker Permission Issues

If you encounter a permission error when running Docker commands:

```
permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock
```

We've created scripts to help you diagnose and fix this issue:

1. First, test if you have Docker permissions:
   ```bash
   # Make the script executable
   chmod +x test_docker_permissions.sh

   # Run the test script
   ./test_docker_permissions.sh
   ```

2. If the test fails, fix the permissions:
   ```bash
   # Make the script executable
   chmod +x fix_docker_permissions.sh

   # Run the fix script
   ./fix_docker_permissions.sh
   ```

The fix script will add your user to the docker group, which is the recommended solution. After running the script, you'll need to log out and log back in for the changes to take effect.

For more detailed information on Docker permission issues and alternative solutions, see the [Deployment Guide](DEPLOYMENT.md#docker-permission-issues).
