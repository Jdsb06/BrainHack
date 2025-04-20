# BrainHack Architecture Note

## Overview

BrainHack is designed with a split architecture where:

- **Frontend**: Hosted at [https://brainhack-51c00.web.app/](https://brainhack-51c00.web.app/)
- **Backend (ML/AI)**: Runs locally on your machine

This architecture was chosen to simplify deployment while maintaining the full functionality of the application.

## Why This Architecture?

The decision to run the ML/AI components locally was made for several reasons:

1. **Complexity of Backend Deployment**: Deploying ML models and AI services to production environments can be complex and expensive.
2. **API Key Management**: Keeping API keys secure is easier when running services locally.
3. **Development Flexibility**: Local development allows for easier testing and iteration of ML models.
4. **Cost Efficiency**: Running ML models locally avoids cloud computing costs.

## How It Works

### Frontend (Hosted)
- The Next.js frontend is deployed to Firebase Hosting
- Users access the application at [https://brainhack-51c00.web.app/](https://brainhack-51c00.web.app/)
- The frontend includes all UI components, animations, and user interactions

### Backend (Local)
- The ML model for distraction prediction runs on a local Flask server
- The Gemini AI chat bot runs through a local API route
- These services are configured to run on `localhost:5000` and `localhost:3000/api/chat` respectively

### Communication Flow
1. User interacts with the hosted frontend
2. Frontend makes API calls to your local machine
3. Local ML/AI services process the requests and return responses
4. Frontend displays the results to the user

## Setup Instructions

### For Development
1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables in `.env.local`
4. Start the local development server with `npm run dev`
5. The application will be available at `http://localhost:3000`

### For Production Use
1. Deploy the frontend to Firebase Hosting
2. Run the local ML/AI services on your machine
3. Configure the frontend to point to your local machine's IP address
4. Users can access the frontend at [https://brainhack-51c00.web.app/](https://brainhack-51c00.web.app/)

## Limitations

- The ML/AI features will only work when your local machine is running
- Users must be on the same network as your machine to access the backend services
- For a fully hosted solution, you would need to deploy the ML models to a cloud service

## Future Improvements

- Deploy ML models to a cloud service like Google Cloud AI Platform
- Use serverless functions for the AI chat bot
- Implement a proper backend service with authentication and data persistence

## Conclusion

This architecture provides a practical solution for running complex ML/AI features while keeping the deployment process simple. While it has some limitations, it allows for full functionality during development and testing.
