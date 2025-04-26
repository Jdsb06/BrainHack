# BrainHack - Your Personal Productivity and Mental Wellness Companion

![BrainHack Logo](public/logo.png)

## Overview

BrainHack is an innovative web application that combines cutting-edge AI technology with neuroscience principles to help users achieve optimal focus and maintain mental wellness. The platform features an interactive brain visualization, AI-powered distraction risk prediction, and an intelligent chat assistant.

## Features

### 1. Interactive Brain Visualization
- Split-brain animation representing the harmony between analytical and creative thinking
- Left hemisphere showcases logical processing in grayscale
- Right hemisphere displays creativity through vibrant colors
- Dynamic animations respond to user interactions
- Custom cursor effects and gradient overlays

### 2. Distraction Risk Predictor
- AI-powered tool that analyzes multiple factors affecting focus
- Input parameters include:
  - Time of day and location
  - Current activity and productive session duration
  - Stress and fatigue levels
  - Recent notifications and phone usage
- Provides personalized risk assessments and actionable recommendations
- Includes a focus timer with customizable session lengths

### 3. AI Chat Assistant
- Powered by Google's Gemini AI
- Provides personalized advice on:
  - Productivity strategies
  - Mental wellness tips
  - Time management techniques
  - Focus improvement methods
- Maintains conversation history for context-aware responses

### 4. User Authentication
- Secure login and registration system
- Firebase authentication integration
- User profile management
- Saved predictions and chat history

## Technology Stack

### Frontend
- **Next.js 15** - React framework for server-rendered applications
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **GSAP** - Advanced animations
- **AOS** - Scroll animations
- **Three.js** - 3D graphics (for brain visualization)

### Backend
- **Firebase** - Authentication, Firestore database, and hosting
- **Google Gemini AI** - Natural language processing for chat assistant
- **Flask API** - Machine learning model for distraction prediction

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/Jdsb06/BrainHack.git
cd BrainHack
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:
```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
brain_hack/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/             # API routes
│   │   ├── ask-ai/          # AI chat page
│   │   ├── login/           # Login page
│   │   ├── register/        # Registration page
│   │   ├── risk-predictor/  # Distraction risk predictor page
│   │   └── ...
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utility functions and Firebase setup
│   └── styles/              # Global styles
├── scripts/                 # Utility scripts
├── .env.local               # Environment variables
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

## Deployment

The application is deployed on Firebase Hosting. To deploy:

```bash
npm run build
firebase deploy --only hosting
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for providing the chat capabilities
- Firebase for authentication and hosting
- The open-source community for the various libraries used in this project


## Features & Future Vision

| Feature                     | Current Implementation                                                                                   | Future Vision                                                                                                                               |
|-----------------------------|----------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| **Distraction Risk Predictor**  | AI model flags high-risk moments based on time, stress, notifications, and usage patterns                | **Next-Step Simulation**: a reinforcement-learning engine that shows you “if you skip your break, here’s the 1-hr focus drop” in real time     |
| **Personalized Recommendations** | Static suggestions for breaks, content swaps, and focus tweaks based on past behavior                   | **Adaptive RL Advisor**: learns from your feedback to refine advice continuously, even predicting long-term habit impact (“Your focus streak will improve by 12% if you follow this…”) |
| **AI Chat Assistant**           | Context-aware chat powered by Gemini AI offering tips on productivity and wellness                     | **Proactive Coach**: autonomously pings you with mini-sessions (“Hey, I noticed your focus is slipping—want a 2-min breathing exercise?”)     |
| **Goal Tracking**               | Track daily, 30-day, 90-day, and annual goals with progress rings and subtasks                         | **Dynamic Micro-Goals**: auto-generate bite-sized habits (e.g., “Read 2 pages now”) and adjust goal difficulty using RL based on your performance curve |
| **Focus Timer**                 | Preset/custom timers + end-session stats and break prompts                                              | **Smart Scheduler**: the app auto-schedules your next focus block by forecasting your peak hours from past data and calendar context        |
| **Analytics Dashboard**         | Visualize trends with sparklines and pie/circular charts                                                | **Predictive Forecasting**: run “what-if” scenarios—see how today’s schedule tweaks could boost next week’s total focus time by X%           |



## Meet the BrainHack Team 🧠✨

- 👨‍💻 **Jashandeep Singh Bedi**  
  - 📧 [Email](mailto:jashandeepsingh.b@iiitb.ac.in)  
  - 🔗 [LinkedIn](https://linkedin.com/in/jdsb06)  
  - 🐙 [GitHub](https://github.com/Jdsb06)

- 👩‍💻 **Heer**  
  - 📧 [Email](mailto:heer@iiitb.ac.in)
  - 🔗 [LinkedIn](https://linkedin.com/in/heer-grover)  
  - 🐙 [GitHub](https://github.com/Heer-create-lgtm)

- 👨‍💻 **Lakshay Jain**  
  - 📧 [Email](mailto:lakshya.jain@iiitb.ac.in)
  - 🔗 [LinkedIn](https://linkedin.com/in/lakshayjain)  
  - 🐙 [GitHub](https://github.com/anonymousz77)

