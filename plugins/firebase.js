import { initializeApp } from 'firebase/app';

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BACKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENSORID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MESURE_ID
};
const app = initializeApp(config);
export default app;
