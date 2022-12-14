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
    <ul className={`nav nav-tabs`} >
      {/* Afficher l'utilisateur une fois inscript */}
      {(isAuth ? <li className="nav-item Utilisateur"style={{display:(isAuth ? "flex" : "none")}}>
        <img referrerPolicy="no-referrer" className="imgUtilisateur" src={`${ctx.user.photoURL}`} alt={ctx.user.displayName}/></li> : null)}
        <li className="nav-item" style={{display:(isAuth ? "none" : "block")}}>
        <Link className="nav-link" to="/accueil">
          Authentification
        </Link>
      </li>
      <li className="nav-item" style={{display:(isAuth ? "block" : "none")}}>
        <Link className="nav-link" to="/accueil">
          Accueil
        </Link>
      </li>
      <li className="nav-item" style={{display:(isAuth ? "block" : "none")}}>
      <Link style={{display:(isAuth ? "block" : "none")}} className="nav-link" to="/projets">Projets</Link>
      </li>
      <li className="nav-item" style={{display:(isAuth ? "block" : "none")}}>
      <Link style={{display:(isAuth ? "block" : "none")}} className="nav-link" to="/membres">Membres</Link>
      </li>
      <li className="nav-item" style={{display:(isAuth ? "block" : "none")}}>
        <Link className="nav-link" to="/clients">
          Clients
        </Link>
      </li>
      
      <li className="btnDeconnexion">
        <button onClick={e=>btnDeconnexion(e)} style={{display:(isAuth ? "block" : "none")}} className="nav-link">Déconnexion</button>
      </li>
    </ul>
  );
};

export default Header;
