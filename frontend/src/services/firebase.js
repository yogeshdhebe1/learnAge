import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2MV-5N4RMM28431O3flBcy9VZZI1l0dI",
  authDomain: "learnage-92436.firebaseapp.com",
  projectId: "learnage-92436",
  storageBucket: "learnage-92436.firebasestorage.app",
  messagingSenderId: "56882910372",
  appId: "1:56882910372:web:ef332fe3316e1f27e74231",
  measurementId: "G-L3SYC5XNRH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
