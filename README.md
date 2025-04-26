# BrainHack – Your Personal Productivity & Mental Wellness Companion

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE) [![Version](https://img.shields.io/badge/version-1.0-blue.svg)]() [![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)]() [![Firebase](https://img.shields.io/badge/Firebase-backend-yellow.svg)]()

---

## Table of Contents
- [Demo](#demo)  
- [Overview](#overview)  
- [Features](#features)  
- [Future Roadmap](#future-roadmap)  
- [Technology Stack](#technology-stack)  
- [Getting Started](#getting-started)  
- [Project Structure](#project-structure)  
- [Deployment](#deployment)  
- [Contributing](#contributing)  
- [License](#license)  
- [Meet the BrainHack Team](#meet-the-brainhack-team)  

---

## Demo
> *(Add your animated GIF or screenshot here)*  
![BrainHack Demo](public/demo.gif)

---

## Overview
BrainHack is an innovative web app that blends AI and neuroscience to help you:
- 🔍 Understand and predict distraction risk  
- 🧭 Track and achieve your goals across multiple time horizons  
- 🤖 Chat with an AI-powered coach for productivity & wellness tips  
- ⏱️ Run focus sessions with data-driven recommendations  

---

## Features
1. **Interactive Brain Visualization**  
   - Split-brain UI showing logic vs. creativity, with responsive animations.  
2. **Distraction Risk Predictor**  
   - ML model flags high-risk moments using time, stress, notifications & usage data.  
3. **AI Chat Assistant**  
   - Context-aware coach powered by Google’s Gemini AI for productivity & wellness advice.  
4. **Goal Tracking**  
   - Manage Today, 30-Day, 90-Day & 1-Year goals with progress rings & subtasks.  
5. **Focus Timer**  
   - Preset/custom sessions, end-session stats, break suggestions, and distraction-free mode.  
6. **Analytics Dashboard**  
   - Sparklines and mini-charts visualize your focus vs. distraction trends.

---

## Future Roadmap

| Feature                     | Vision                                                                                                                        |
|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| Distraction Risk Predictor  | **Next-Step Simulation:** RL engine shows “If you skip your break, here’s your 1-hr focus drop” in real time.                  |
| Personalized Recommendations| **Adaptive RL Advisor:** Continuously refines tips based on your feedback and predicts long-term habit impact.               |
| AI Chat Assistant           | **Proactive Coach:** Auto-pings mini-sessions (“Your focus is slipping—try a 2-min breathing exercise?”).                     |
| Goal Tracking               | **Dynamic Micro-Goals:** RL-powered bite-sized tasks (e.g., “Read 2 pages now”) and auto-adjust difficulty per performance.  |
| Focus Timer                 | **Smart Scheduler:** Auto-schedules your next focus block using peak-hour forecasting and calendar context.                  |
| Analytics Dashboard         | **Predictive Forecasting:** “What-if” scenarios—see how today’s tweaks could boost next week’s total focus time by X%.       |

---

## Technology Stack

### Built With
<p>
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />  
  <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript" alt="TypeScript" />  
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css" alt="Tailwind CSS" />  
  <img src="https://img.shields.io/badge/Framer%20Motion-000?logo=framer" alt="Framer Motion" />  
  <img src="https://img.shields.io/badge/Three.js-000?logo=three.js" alt="Three.js" />  
  <img src="https://img.shields.io/badge/Firebase-FFF00F?logo=firebase" alt="Firebase" />  
  <img src="https://img.shields.io/badge/Python-3776AB?logo=python" alt="Python" />  
</p>

---

## Getting Started

### Prerequisites
- Node.js v18+  
- npm or yarn  
- Firebase account  
- Google Gemini API key  

### Installation
```bash
# Clone repo
git clone https://github.com/Jdsb06/BrainHack.git
cd BrainHack
```
```bash
# Install dependencies
npm install
```
```bash
# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase & Gemini keys
```
```bash
# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser

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

