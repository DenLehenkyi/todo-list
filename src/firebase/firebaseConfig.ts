import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEctwy-c7btE1fwMTPkSIMr74UYF59VXs",
  authDomain: "todo-list-6b2d5.firebaseapp.com",
  projectId: "todo-list-6b2d5",
  storageBucket: "todo-list-6b2d5.firebasestorage.app",
  messagingSenderId: "482038924020",
  appId: "1:482038924020:web:ffb124284467d17afd94a1",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
