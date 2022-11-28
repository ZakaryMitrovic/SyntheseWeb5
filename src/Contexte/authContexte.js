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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      console.log(user);
      setUser(user);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    const creds = await signInWithPopup(auth, provider);
    setUser(creds.user);

    const docRef = doc(db, 'membres', creds.user.uid);
    const projRef = doc(db, 'membres', creds.user.uid, "projets", creds.user.uid);

    const { isNewUser } = getAdditionalUserInfo(creds) // <-- or result of signInWithRedirect();

    if (isNewUser) {
      // user has signed in first time
      await setDoc(docRef, {
            nom: creds.user.displayName,
            email: creds.user.email,
            photoURL: creds.user.photoURL,
            contacts: [],
            clients: []
          });
    } else {
      // Existing user, document created already. 
      await getDoc(docRef);
      await getDoc(projRef);
    }
    
  };

  const logout = async () => {
    const creds = await signOut(auth);
    setUser(creds);
  };
  return (
    <Provider value={{ user, login, logout, isLoading }}>
      {children}
    </Provider>
  );
};
export { AuthProvider, authContexte };
