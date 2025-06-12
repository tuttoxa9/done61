// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQupIv5k8i53KI-CyaENNkWEyXA9k4cIA",
  authDomain: "globalcrm-db5f8.firebaseapp.com",
  projectId: "globalcrm-db5f8",
  storageBucket: "globalcrm-db5f8.firebasestorage.app",
  messagingSenderId: "905787181763",
  appId: "1:905787181763:web:88ae2482f9760fd5903076",
  measurementId: "G-E31VB2MQZ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firestore
export const db = getFirestore(app);

export { app, analytics };
