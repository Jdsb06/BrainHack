# BrainHack: ML-Powered Distraction Predictor

BrainHack is a machine learning application that predicts the risk of distraction based on various factors like time of day, location, current activity, and more. This README provides instructions on how to integrate the ML model with Firebase and deploy the application.

## Project Structure

- `app.py`: Flask application that serves the ML model
- `train_model.py`: Script for training the ML model
- `prepare_data.py`: Script for preparing the training data
- `predictor.py`: Module for using the distraction predictor in other projects
- `example_usage.py`: Example script demonstrating how to use the predictor
- `distraction_model.pkl`: Trained ML model
- `feature_columns.pkl`: Feature columns used by the model
- `templates/`: Frontend HTML templates
- `firebase_integration_example/`: Example of Firebase integration
- `deployment_scripts/`: Scripts for deploying to various platforms
- `integration_guide.md`: Detailed guide on integrating with Firebase
- `usage_guide.md`: Guide on how to use the predictor in other Python projects

## Integration with Firebase

This project includes a comprehensive guide on how to integrate the ML model with Firebase. See `integration_guide.md` for detailed instructions.

### Quick Start

1. Set up a Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Deploy the Flask backend to a Python-friendly platform (see Deployment section)
3. Update the Firebase integration example with your Firebase config and backend URL
4. Deploy the frontend to Firebase Hosting or GitHub Pages

## Deployment Options

### Option 1: Deploy Backend to Heroku

```bash
# Make the script executable
chmod +x deployment_scripts/deploy_to_heroku.sh

# Run the deployment script
./deployment_scripts/deploy_to_heroku.sh
```

### Option 2: Deploy Backend to Google Cloud Run (Recommended for ML)

```bash
# Make the script executable
chmod +x deployment_scripts/deploy_to_cloud_run.sh

# Run the deployment script
./deployment_scripts/deploy_to_cloud_run.sh
```

### Option 3: Deploy Frontend to GitHub Pages

```bash
# Make the script executable
chmod +x deployment_scripts/deploy_to_github_pages.sh

# Run the deployment script
./deployment_scripts/deploy_to_github_pages.sh
```

## Firebase Integration Example

The `firebase_integration_example/` directory contains a sample implementation of the frontend with Firebase integration. To use it:

1. Update the Firebase configuration in the HTML file with your own Firebase project details
2. Update the API endpoint to point to your deployed backend
3. Deploy the frontend to Firebase Hosting or GitHub Pages

```html
<!-- Update this configuration with your Firebase project details -->
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};
```

## Using the Predictor in Your Own Project

If you want to use the distraction prediction functionality in your own Python project (without the web interface), you can use the `DistractionPredictor` class provided in `predictor.py`. This allows you to easily integrate the ML model into any Python application.

See `usage_guide.md` for detailed instructions and examples on how to use the predictor in your own projects.

For a working example, check out `example_usage.py`, which demonstrates how to use the predictor with different types of input data.

## Recommended Architecture

For the best performance and integration:

1. **Frontend**: Deploy to Firebase Hosting
2. **Backend**: Deploy Flask API to Google Cloud Run or Heroku
3. **Database**: Use Firebase Firestore to store user data and prediction history
4. **Authentication**: Use Firebase Authentication

This approach gives you the best of both worlds - Firebase's excellent frontend hosting and real-time database capabilities, combined with a proper Python environment for your ML model.

## Important Notes

- GitHub Pages only supports static websites, so you'll need to host your Flask backend separately
- The ML model requires Python, which is not supported by Firebase Functions directly
- For a production environment, consider implementing rate limiting and authentication for your API

## Troubleshooting

- If you encounter CORS issues, make sure your Flask backend has CORS enabled:
  ```python
  from flask_cors import CORS
  app = Flask(__name__)
  CORS(app)  # Enable CORS for all routes
  ```

- If your model is too large for deployment, consider:
  1. Reducing model size through pruning or quantization
  2. Using a more powerful tier in your hosting platform
  3. Converting to a more efficient format like ONNX

## License

This project is licensed under the MIT License - see the LICENSE file for details.
