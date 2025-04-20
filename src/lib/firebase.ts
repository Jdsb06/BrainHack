"use client";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, doc, addDoc, updateDoc, getDoc, query, where, orderBy, limit, Timestamp, getDocs } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCa9Asoh8kAyD2p7TLFnXmcKTl-XbVGvVg",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "brainhack-51c00.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "brainhack-51c00",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "brainhack-51c00.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "857072955930",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://brainhack-51c00.firebaseio.com",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:857072955930:web:7af02ad38e5659a43357a3",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XY8NLT8GMM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Sign in with GitHub
export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with GitHub:", error);
    throw error;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing up with email:", error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

// Productivity tracking functions

// Start a focus session
export const startFocusSession = async () => {
  try {
    const startFocusSessionFn = httpsCallable(functions, 'startFocusSession');
    const result = await startFocusSessionFn();
    return result.data;
  } catch (error) {
    console.error("Error starting focus session:", error);
    throw error;
  }
};

// End a focus session
export const endFocusSession = async (sessionId: string, interrupted: boolean = false) => {
  try {
    const endFocusSessionFn = httpsCallable(functions, 'endFocusSession');
    const result = await endFocusSessionFn({ sessionId, interrupted });
    return result.data;
  } catch (error) {
    console.error("Error ending focus session:", error);
    throw error;
  }
};

// Record a break
export const recordBreak = async (durationSeconds: number) => {
  try {
    const recordBreakFn = httpsCallable(functions, 'recordBreak');
    const result = await recordBreakFn({ durationSeconds });
    return result.data;
  } catch (error) {
    console.error("Error recording break:", error);
    throw error;
  }
};

// Get dashboard data
export const getDashboardData = async () => {
  try {
    const getDashboardDataFn = httpsCallable(functions, 'getDashboardData');
    const result = await getDashboardDataFn();
    return result.data;
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    throw error;
  }
};

// Store risk prediction
export const storeRiskPrediction = async (predictionData: {
  riskPercentage: number;
  recommendation: string;
  alternative: string;
  inputs: Record<string, string>;
}) => {
  try {
    if (!auth.currentUser) {
      throw new Error("User must be authenticated to store risk prediction");
    }

    const userId = auth.currentUser.uid;
    const predictionRef = collection(db, "users", userId, "riskPredictions");

    const prediction = {
      timestamp: Timestamp.now(),
      riskPercentage: predictionData.riskPercentage,
      recommendation: predictionData.recommendation,
      alternative: predictionData.alternative,
      inputs: predictionData.inputs
    };

    const docRef = await addDoc(predictionRef, prediction);
    console.log("Risk prediction stored with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error storing risk prediction:", error);
    throw error;
  }
};

export { auth, db };
