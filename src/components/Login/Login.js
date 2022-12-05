import GoogleButton from "react-google-button";
import { async } from "@firebase/util";
import React, { useContext, useState } from "react";
import { authContexte } from "../../Contexte/authContexte";
const Login = () =>{
    const ctx = useContext(authContexte);
    const HandleGoogleSignIn = async () => {
        ctx.login();
    };

    return (
        <>
            <div className="Login">
                <div className="Compagnie">
                <img className="Logo" src="monkey.png" alt="logo" />
                <h1 className="color-warning">MaZaque Inc.</h1>
                <img className="Logo" src="monkeyFlip.png" alt="logo" />
                </div>
                <h2>Authentification avec Google</h2>
              


                
                <GoogleButton 
                label="Connexion avec Google"
                type="light"
                
                onClick={HandleGoogleSignIn}/>
                
            </div>
        </>
    );

};
export default Login;