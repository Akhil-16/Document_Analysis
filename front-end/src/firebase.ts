import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzLVNcjWq6lcOqnC5iSTX3_DkKR1VKvTo",
  authDomain: "score-master-93968.firebaseapp.com",
  projectId: "score-master-93968",
  storageBucket: "score-master-93968.appspot.com",
  messagingSenderId: "65535981660",
  appId: "1:65535981660:web:36d32150eaaadeddafce99",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
