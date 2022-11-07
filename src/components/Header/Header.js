import { Link } from "react-router-dom";
import { authContexte } from "../../Contexte/authContexte";
import { useContext, useState } from "react";

const Header = (props) => {
  const ctx = useContext(authContexte);

  let isAuth = false;
  if (ctx.user !== undefined) {
    isAuth = true;
  }

  const btnDeconnexion = async (e) => {
    e.preventDefault();
    ctx.logout();
    isAuth = false;
  };

  return (
    <ul className="nav nav-tabs">
      <li className="nav-item" style={{display:(isAuth ? "block" : "block")}}>
        <Link className="nav-link" to="/login">
          Authentification
        </Link>
      </li>
      <li className="nav-item" style={{display:(isAuth ? "block" : "block")}}>
        <Link className="nav-link" to="/accueil">
          Accueil
        </Link>
      </li>
      <li className="nav-item" style={{display:(isAuth ? "block" : "block")}}>
      <Link style={{display:(isAuth ? "block" : "none")}} className="nav-link" to="/creerprojet">Créer un Projet</Link>
      </li>
      <li className="nav-item">
        <button onClick={e=>btnDeconnexion(e)} style={{display:(isAuth ? "block" : "block")}} className="nav-link">Déconnexion</button>
      </li>
    </ul>
  );
};

export default Header;
