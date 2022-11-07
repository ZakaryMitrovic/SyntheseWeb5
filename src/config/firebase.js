
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyD7u2_PLD4wAg-ec7qlblAfxeh7fAe57Sw",
  authDomain: "synthese-aacf7.firebaseapp.com",
  projectId: "synthese-aacf7",
  storageBucket: "synthese-aacf7.appspot.com",
  messagingSenderId: "1061528563086",
  appId: "1:1061528563086:web:d147a83ca2d36acf0688df"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {db, auth};