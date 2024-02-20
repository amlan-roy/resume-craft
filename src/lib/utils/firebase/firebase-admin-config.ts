/**
 * Configuration file for Firebase Admin.
 * This file exports a function `customInitApp` that initializes the Firebase Admin app
 * with the provided credentials.
 *
 * This config file is used for server-side operations that require administrative access to Firebase services.
 */

import { initializeApp, getApps, cert } from "firebase-admin/app";

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  }),
};

/**
 * Initializes the Firebase Admin app with the provided credentials.
 * If the app is already initialized, this function does nothing.
 */
export function customInitApp() {
  if (getApps().length <= 0) {
    initializeApp(firebaseAdminConfig);
  }
}
