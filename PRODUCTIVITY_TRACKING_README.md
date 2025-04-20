# Productivity Tracking Application Setup

This README provides instructions for setting up and deploying the productivity tracking application using Firebase Authentication and Firestore.

## Overview

The productivity tracking application displays a dashboard with four metrics:
1. **Distraction Risk Level**: Percentage of interrupted focus sessions in the last 24 hours
2. **Daily Statistics**: Focus time (hours) and breaks taken today
3. **Weekly Statistics**: Productive days (≥4 hours focus) and average focus time this week
4. **Productivity Score**: Score (0-100) based on total focus time over the last 7 days

## Database Design

The application uses Firestore with the following structure:

```
/users/{userId}/
  /focusSessions/{sessionId}/
    - start_time: Timestamp
    - end_time: Timestamp
    - duration: number (seconds)
    - interrupted: boolean
  /breaks/{breakId}/
    - timestamp: Timestamp
    - duration: number (seconds)
```

## Setup Instructions

### 1. Firebase Project Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Firebase Authentication with the methods you want to support (Email/Password, Google, GitHub)
3. Create a Firestore database in production mode

### 2. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 3. Initialize Firebase in your project

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init
```

Select the following options:
- Firestore
- Functions
- Hosting
- Use an existing project (select your Firebase project)
- Accept the default options for Firestore rules and indexes
- Choose JavaScript or TypeScript for Functions
- Install dependencies with npm

### 4. Deploy Firebase Functions and Rules

After implementing the Cloud Functions and Firestore rules:

```bash
# Deploy everything
firebase deploy

# Or deploy specific features
firebase deploy --only functions
firebase deploy --only firestore:rules
```

## Frontend Integration

### 1. Install Firebase SDK

```bash
npm install firebase
```

### 2. Configure Firebase in your application

Create a `firebase.ts` file with your Firebase configuration:

```typescript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, functions };
```

### 3. Use the Dashboard Component

Import and use the Dashboard component in your application:

```jsx
import Dashboard from '@/components/Dashboard';

function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}
```

## Usage

### Starting a Focus Session

```typescript
import { startFocusSession } from '@/lib/firebase';

// Start a focus session
const startSession = async () => {
  try {
    const result = await startFocusSession();
    console.log('Session started:', result);
    // Store the sessionId for ending the session later
    setCurrentSessionId(result.sessionId);
  } catch (error) {
    console.error('Error starting session:', error);
  }
};
```

### Ending a Focus Session

```typescript
import { endFocusSession } from '@/lib/firebase';

// End a focus session
const endSession = async (sessionId, interrupted = false) => {
  try {
    const result = await endFocusSession(sessionId, interrupted);
    console.log('Session ended:', result);
  } catch (error) {
    console.error('Error ending session:', error);
  }
};
```

### Recording a Break

```typescript
import { recordBreak } from '@/lib/firebase';

// Record a break
const takeBreak = async (durationSeconds) => {
  try {
    const result = await recordBreak(durationSeconds);
    console.log('Break recorded:', result);
  } catch (error) {
    console.error('Error recording break:', error);
  }
};
```

### Getting Dashboard Data

```typescript
import { getDashboardData } from '@/lib/firebase';

// Get dashboard data
const fetchDashboardData = async () => {
  try {
    const data = await getDashboardData();
    console.log('Dashboard data:', data);
    // Update your UI with the data
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};
```

## Performance Considerations

1. **Caching**: Consider caching dashboard data to reduce Firestore reads
2. **Pagination**: If a user has many focus sessions, use pagination when querying
3. **Aggregation**: For users with large datasets, consider precomputing metrics and storing them in a separate collection
4. **Indexes**: Create appropriate indexes for queries that filter and sort data

## Time Zone Handling

The application uses UTC timestamps for consistency. When displaying dates and times to users, convert to their local time zone:

```typescript
// Convert UTC timestamp to local time
const localTime = new Date(timestamp.toDate()).toLocaleString();
```

## Security Considerations

1. **Authentication**: Always verify the user is authenticated before accessing data
2. **Firestore Rules**: Use Firestore security rules to restrict access to authenticated users' data
3. **Cloud Functions**: Validate authentication in Cloud Functions
4. **Input Validation**: Validate all input data in Cloud Functions