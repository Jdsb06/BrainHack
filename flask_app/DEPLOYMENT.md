# Deployment Guide for Distraction Risk Predictor Flask API

This guide provides instructions for deploying the Distraction Risk Predictor Flask API to production environments.

## Prerequisites

- Python 3.7+ installed on your deployment machine
- Git (for cloning the repository)
- Access to a server or local machine where you want to run the Flask app

## Deployment Options

### 1. Traditional Deployment with Gunicorn (Recommended)

If you prefer not to use Docker, you can deploy the application directly with Gunicorn:

1. Clone the repository:
   ```bash
   git clone [REPOSITORY-URL]
   cd brain_hack/flask_app
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set environment variables:
   ```bash
   export FLASK_ENV=production
   export FLASK_PORT=8080
   export ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

4. Start the application with Gunicorn:
   ```bash
   gunicorn --bind 0.0.0.0:8080 app:app --workers 4
   ```

5. Set up a reverse proxy (Nginx or Apache) to forward requests to Gunicorn.

## Environment Variables

- `FLASK_ENV`: Set to `production` for production deployment
- `FLASK_PORT`: The port on which the application will run (default: 8080)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (default: *)

## Handling the XGBoost Model

The application uses an XGBoost model that may generate warnings about serialization. If you encounter issues with the model:

1. Uncomment the code block in `app.py` that converts the model to XGBoost's native format
2. Rebuild the Docker image or restart the application

## Monitoring and Logging

For production deployments, consider setting up:

1. Application monitoring with tools like Prometheus, Grafana, or cloud provider monitoring services
2. Centralized logging with ELK stack, Graylog, or cloud provider logging services
3. Error tracking with Sentry or similar services

## Security Considerations

1. Set specific allowed origins in the `ALLOWED_ORIGINS` environment variable
2. Consider adding authentication for the API endpoints
3. Use HTTPS for all communications
4. Regularly update dependencies to address security vulnerabilities

## Scaling

The application can be scaled horizontally by:

1. Increasing the number of Gunicorn workers
2. Deploying multiple instances behind a load balancer
3. Using auto-scaling features of cloud providers

## Troubleshooting

### Flask and Werkzeug Compatibility

If you encounter an error like this when running the Flask app:

```
ImportError: cannot import name 'url_quote' from 'werkzeug.urls'
```

This is due to a compatibility issue between Flask and Werkzeug versions. We've updated the requirements.txt file to specify Werkzeug 2.0.1, which is compatible with Flask 2.0.1.

Make sure to install the correct version of Werkzeug:

```bash
pip install werkzeug==2.0.1
```

### Numpy and Scikit-learn Version Compatibility

If you encounter an error like this when loading the model:

```
ModuleNotFoundError: No module named 'numpy._core'
```

Or warnings about scikit-learn version mismatches:

```
UserWarning: Trying to unpickle estimator StandardScaler from version 1.6.1 when using version 0.24.2. This might lead to breaking code or invalid results.
```

This is due to a compatibility issue between the versions of numpy and scikit-learn used to create the model and the versions installed. We've updated the requirements.txt file to specify compatible versions:

- numpy==1.24.0
- scikit-learn==1.6.1

Make sure to install the correct versions:

```bash
pip install numpy==1.24.0 scikit-learn==1.6.1
```

If you need to use different versions for some reason, you may need to retrain the model using those specific versions.

### Other Issues

If you encounter other issues during deployment:

1. Check the application logs for error messages
2. Verify that all environment variables are set correctly
3. Ensure that the model file is correctly placed in the application directory
4. Check that the port is not being used by another application
