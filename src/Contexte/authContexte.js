import { async } from "@firebase/util";
import React, { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import {collection, onSnapshot, addDoc, setDoc, doc, arrayUnion, getDoc} from 'firebase/firestore';


const authContexte = React.createContext({
  login: () => {},
  logout: () => {},
  user: null,
});

const { Provider } = authContexte;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      console.log(user);
      setUser(user);
    });
    return unsub;
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    const creds = await signInWithPopup(auth, provider);
    setUser(creds.user);

    const docRef = doc(db, 'membres', creds.user.uid);
    await getDoc(docRef);
    // await setDoc(docRef, {
    //     nom: creds.user.displayName,
    //     email: creds.user.email,
    //     projets: [],
    //     contacts: []
    // });
  };
  
  const logout = async () => {
    const creds = await signOut(auth);
    setUser(creds);
  };
  return (
    <Provider value={{ user, login, logout }}>
      {children}
    </Provider>
  );
};
export { AuthProvider, authContexte };
