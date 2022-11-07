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
        <div>
            <h1>Login</h1>
            <GoogleButton onClick={HandleGoogleSignIn}/>
        </div>
    );

};
export default Login;