import { async } from "@firebase/util";
import React, { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,getAdditionalUserInfo
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { collection, onSnapshot, addDoc, setDoc, doc, arrayUnion, getDoc, } from 'firebase/firestore';


const authContexte = React.createContext({
  login: () => { },
  logout: () => { },
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
    //faire une condition si l'utilisateur existe dans la base de donner
    //si oui, getdoc
    //sinon, setdoc

    const { isNewUser } = getAdditionalUserInfo(creds) // <-- or result of signInWithRedirect();

    if (isNewUser) {
      // user has signed in first time
      await setDoc(docRef, {
            nom: creds.user.displayName,
            email: creds.user.email,
            photoURL: creds.user.photoURL,
            projets: [],
            contacts: [],
            clients: []
          });
    } else {
      // Existing user, document created already. 
      await getDoc(docRef);
    }
    
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
