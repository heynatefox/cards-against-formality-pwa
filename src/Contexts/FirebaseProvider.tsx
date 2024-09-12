import React, { useEffect, useState } from 'react';

import { initializeApp, deleteApp, type FirebaseApp } from "firebase/app";
import { initializeAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCZLzkZG3s1KZOnASu_RrSL_C2_1PaJTNA",
  authDomain: "cards-against-formality.firebaseapp.com",
  databaseURL: "https://cards-against-formality.firebaseio.com",
  projectId: "cards-against-formality",
  storageBucket: "cards-against-formality.appspot.com",
  messagingSenderId: "963787405555",
  appId: "1:963787405555:web:9a16ebc50e7de8e02d5f86",
  measurementId: "G-CC9C8EF5ZP"
};

export const FirebaseContext = React.createContext<FirebaseApp | null>(null);

export const FirebaseProvider = ({ children }: any) => {
  const [firebase, setFirebase] = useState<FirebaseApp | null>(null);

  useEffect(() => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    if (import.meta.env.PROD) {
      initializeAnalytics(app);
    }
    setFirebase(app);

    return () => {
      setFirebase(null);
      deleteApp(app);
    }
  }, []);

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
}
