/**
 * Firebase configuration file.
 * This file exports the Firebase app instance, authentication, providers, and Firestore database.
 */
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase configuration object.
 * Contains the API key, authentication domain, project ID, storage bucket, messaging sender ID,
 * app ID, and measurement ID.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Firebase app instance.
 * Initializes the Firebase app using the configuration object.
 */
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/**
 * Firebase authentication instance.
 * Provides methods for user authentication.
 */
const auth = getAuth(app);

/**
 * Google authentication provider.
 * Allows users to sign in with their Google accounts.
 */
const googleProvider = new GoogleAuthProvider();

/**
 * Email authentication provider.
 * Allows users to sign in with their email and password.
 */
const emailProvider = new EmailAuthProvider();

/**
 * Firebase Firestore database instance.
 * Provides methods for interacting with the Firestore database.
 */
const db = getFirestore(app);

export { app, auth, googleProvider, emailProvider, db };
