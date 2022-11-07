import { Link } from "react-router-dom";
import { authContexte } from "../../Contexte/authContexte";
import { useContext, useState } from "react";

const Header = (props) => {
  const ctx = useContext(authContexte);

  let isAuth = false;
  if (ctx.user != undefined) {
    isAuth = true;
  }

  const btnDeconnexion = async (e) => {
    e.preventDefault();
    ctx.logout();
    isAuth = false;
  };

  return (
    <ul className="nav nav-tabs">
      <li className="nav-item" style={{display:(isAuth ? "none" : "block")}}>
        <Link className="nav-link" to="/login">
          Authentification
        </Link>
      </li>
      
      <li className="nav-item" style={{display:(isAuth ? "block" : "none")}}>
        <Link className="nav-link" to="/accueil">
          Accueil
        </Link>
      </li>
      <li className="nav-item" style={{display:(isAuth ? "block" : "block")}}>
      <Link style={{display:(isAuth ? "block" : "none")}} className="nav-link" to="/creerprojet">Créer un Projet</Link>
      </li>
      <li className="nav-item" style={{display:(isAuth ? "block" : "block")}}>
      <Link style={{display:(isAuth ? "block" : "none")}} className="nav-link" to="/membres">Membres</Link>
        <Link className="nav-link" to="/CreerClient">
          Ajouter un client
        </Link>
      </li>
      <li className="nav-item" style={{display:(isAuth ? "block" : "block")}}>
        <Link className="nav-link" to="/DetailsClient">
          Voir les Clients
        </Link>
      </li>
      <li className="nav-item">
        <button onClick={e=>btnDeconnexion(e)} style={{display:(isAuth ? "block" : "none")}} className="nav-link">Déconnexion</button>
      </li>
      {(isAuth ? <li className="nav-item" style={{display:(isAuth ? "block" : "none")}}><p className="nav-link">{ctx.user.displayName}</p></li> : null)}
    </ul>
  );
};

export default Header;
