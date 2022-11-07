import { async } from "@firebase/util";
import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const authContexte = React.createContext({
    register: (email, password) => {},
    login: (email,password) => {},
    logout: () => {},
    user: null
});

const {Provider} = authContexte;

const AuthProvider = ({children}) =>{
    const [user, setUser] = useState();

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(user => {
            console.log(user);
            setUser(user);
        });
        return unsub;
    }, []);

    const register = async(email,password)=>{
        const creds = await createUserWithEmailAndPassword(auth, email, password);
        setUser(creds.user);
    };
    const login = async(email,password)=>{
        const creds = await signInWithEmailAndPassword(auth, email, password);
        setUser(creds.user);
    };
    const logout = async()=>{
        const creds = await signOut(auth);
        setUser(creds);
    };

    return(
        <Provider value={{user, register, login, logout}}>
            {children}
        </Provider>
    );
};

export {AuthProvider, authContexte};