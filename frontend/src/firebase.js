// Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// @ts-ignore
const apiKey = import.meta.env.VITE_FIREBASE_APIKEY;
// @ts-ignore
const authDomain = import.meta.env.VITE_FIREBASE_AUTHDOMAIN;
// @ts-ignore
const projectId = import.meta.env.VITE_FIREBASE_PROJECTID;
// @ts-ignore
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE;
// @ts-ignore
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING;
// @ts-ignore
const appId = import.meta.env.VITE_FIREBASE_APPID;
// @ts-ignore
const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENTID;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId
};

export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
export const auth = getAuth(app);
export const db = getFirestore(app);
