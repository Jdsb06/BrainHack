# Integrating the BrainHack ML Model with Firebase and Deployment Guide

## Overview
This guide explains how to integrate the BrainHack distraction prediction ML model with a Firebase website and provides deployment options.

## 1. Integration with Firebase

### Option 1: Firebase Hosting + Cloud Functions (Recommended)

Firebase doesn't natively support Python Flask applications, but you can use the following approach:

1. **Set up Firebase Cloud Functions**:
   - Create a Node.js Cloud Function that acts as an API endpoint
   - Use the Firebase Admin SDK to call your ML model

2. **Convert your ML model for JavaScript**:
   - Export your model to ONNX format or TensorFlow.js
   - Use a JavaScript ML library to load and run the model

3. **Alternative: Keep Python Backend**:
   - Deploy your Flask app to Cloud Run or another service
   - Connect your Firebase frontend to this API

### Option 2: Firebase Hosting + External API

1. **Deploy Flask API separately**:
   ```bash
   # Install Gunicorn
   pip install gunicorn

   # Create requirements.txt
   pip freeze > requirements.txt
   ```

2. **Deploy to a Python-friendly platform**:
   - Heroku
   - Google Cloud Run
   - AWS Lambda
   - PythonAnywhere

3. **Update your Firebase app to call the external API**:
   ```javascript
   // In your Firebase app
   fetch('https://your-flask-api.herokuapp.com/predict', {
     method: 'POST',
     body: new FormData(document.getElementById('prediction-form'))
   })
   .then(response => response.json())
   .then(data => {
     // Update UI with prediction results
   });
   ```

## 2. Implementation Steps

### Step 1: Prepare Your ML Model
```python
# Convert model to ONNX (if going with client-side prediction)
import onnx
import onnxmltools
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType, StringTensorType

# Load your model
with open('distraction_model.pkl', 'rb') as f:
    model = pickle.load(f)

# Convert to ONNX
onnx_model = convert_sklearn(model, 'distraction_model', 
                            [('input', FloatTensorType([None, len(feature_columns)]))])
onnxmltools.utils.save_model(onnx_model, 'distraction_model.onnx')
```

### Step 2: Set Up Firebase Project
1. Create a Firebase project in the Firebase console
2. Initialize Firebase in your web app:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   ```

### Step 3: Integrate with Firebase
1. Move your HTML/CSS/JS to the Firebase public folder
2. Update your JavaScript to use Firebase Authentication and Firestore:

```javascript
// Initialize Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// Save prediction results to Firestore
function savePrediction(userId, predictionData) {
  firebase.firestore().collection('predictions')
    .add({
      userId: userId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      riskPercentage: predictionData.risk_percentage,
      recommendation: predictionData.recommendation,
      inputs: formData
    })
    .then(() => console.log("Prediction saved"))
    .catch(error => console.error("Error saving prediction:", error));
}
```

## 3. Deployment Options

### Option 1: GitHub Pages (Static Frontend Only)
GitHub Pages only supports static websites, so you would need to:
1. Deploy your Flask backend separately
2. Use GitHub Pages for the frontend only

**Limitations**:
- Cannot run Python/Flask directly on GitHub Pages
- Need to host your ML model API elsewhere

**Steps**:
```bash
# Create a gh-pages branch
git checkout -b gh-pages

# Copy only frontend files
mkdir -p public
cp -r templates/* public/
# Update API endpoint in JavaScript to point to your hosted API

# Push to GitHub
git add public
git commit -m "Add frontend for GitHub Pages"
git push origin gh-pages
```

### Option 2: Heroku (Full Stack)
Heroku supports Python applications and is ideal for hosting your entire stack:

1. Create a Procfile:
   ```
   web: gunicorn app:app
   ```

2. Deploy to Heroku:
   ```bash
   heroku create brainhack-app
   git push heroku main
   ```

### Option 3: Google Cloud Run (Recommended for ML)
Cloud Run is well-suited for ML applications:

1. Containerize your application:
   ```
   # Create Dockerfile
   FROM python:3.9-slim
   WORKDIR /app
   COPY . .
   RUN pip install -r requirements.txt
   CMD gunicorn --bind :$PORT app:app
   ```

2. Deploy to Cloud Run:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT/brainhack
   gcloud run deploy --image gcr.io/YOUR_PROJECT/brainhack
   ```

## 4. Recommended Approach

For the best performance and integration:

1. **Frontend**: Deploy to Firebase Hosting
2. **Backend**: Deploy Flask API to Cloud Run or Heroku
3. **Database**: Use Firebase Firestore to store user data and prediction history
4. **Authentication**: Use Firebase Authentication

This approach gives you the best of both worlds - Firebase's excellent frontend hosting and real-time database capabilities, combined with a proper Python environment for your ML model.

## 5. Conclusion

While GitHub Pages is an option for hosting the frontend, it's not suitable for the complete application since it doesn't support server-side code. For a production-ready application, consider the hybrid approach with Firebase Hosting for the frontend and a separate Python-friendly service for your ML model API.