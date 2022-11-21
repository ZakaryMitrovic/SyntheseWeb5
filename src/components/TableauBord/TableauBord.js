import { useState, useContext, useEffect } from "react";
import { onSnapshot, collection, addDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { authContexte } from "../../Contexte/authContexte";
import { Link } from "react-router-dom";
import Spinner from "../Spinner/Spinner";

const TableauBord = () => {
    const ctx = useContext(authContexte);
    const [projet, setProjets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [membres, setMembres] = useState([]);
    const [clients, setClients] = useState([]);

    /*POUR LES PROJETS */
    useEffect(() => {
        const getProjet = async () => {
            const unsub = onSnapshot(collection(db, "membres", ctx.user.uid, "projets"), (snapshot) => {
              setProjets(
                snapshot.docs.map((doc) => {
                  return {
                    ...doc.data(),
                    id: doc.id,
                  };
                })
              );
              setIsLoading(false);
            });
            return unsub;
          };
          getProjet();
    }, [projet]);
    
    /*POUR LES MEMBRES */
    useEffect(() => {
        const getMembre = async () => {
          const unsub = onSnapshot(collection(db, "membres"), (snapshot) => {
            setMembres(
              snapshot.docs.map((doc) => {
                return {
                  ...doc.data(),
                  id: doc.id,
                };
              })
            );
            setIsLoading(false);
          });
          return unsub;
        };
        getMembre();
      }, [membres]);

      /*POUR LES CLIENTS */
      useEffect(() => {
        const unsub = onSnapshot(doc(db, "membres", ctx.user.uid), (snapshot) => {
            setClients({
                ...snapshot.data(),
                id: snapshot.id
            })
            setIsLoading(false);
        });
        return unsub;
    }, [clients.length]);

    return (
        <div>
            {isLoading ? (<Spinner />) : (
                <section>
                    {projet.length === 0 ? (
                        <Link to='/creerprojet' className="Projets">
                            <button className="btnLinkProjets btn btn-primary">Créer votre premier projet!</button>
                            <p className="pCreerProjetAccueil">Vous avez 0 projets!</p>    
                        </Link>
                        ) : (
                        <section>
                            <Link to='/projets' className="Projets">
                                <button className="btnLinkProjets btn btn-primary">Voir les projets</button>
                                {projet.map(({ nom, description, color, date }, index) => (
                                    <div className="card" style={{ width: 18 + 'em', border: `2px solid ${color}` }} key={nom + color}>
                                        <img src={"logo512.png"} className="card-img-top" alt="ImgProjet" />
                                        <div className="card-body">
                                            <h5 className="card-title">{nom}</h5>
                                            <p className="card-text">{description}</p>
                                            <small><i>{date}</i></small>
                                        </div>
                                    </div>
                                ))}
                            </Link>
                        </section>
                    )}
                    <article>
                            <Link to='/membres' className="ListMembres">
                                <button className="btnLinkProjets btn btn-primary">Voir les nouveaux membres</button>
                                {membres.map(({nom, email, photoURL}, index) => (
                                    <div className="card" style={{ width: 18 + 'em'}} key={nom+email}>
                                        <img src={photoURL} className="card-img-top" alt={nom} referrerPolicy="no-referrer"/>
                                        <div className="card-body">
                                            <h5 className="card-title">{nom}</h5>
                                            <p className="card-text">{email}</p>
                                        </div>
                                    </div>
                                ))}
                            </Link>
                        {clients.clients.length === 0 ? (<Link to='/creerclient' className="ListClients">
                        <button className="btnLinkProjets btn btn-primary">Ajouter votre premier client!</button>
                        <p className="pCreerProjetAccueil">Vous avez 0 client!</p>    
                        </Link>) : (
                            <Link to='/clients' className="ListClients">
                            <button className="btnLinkProjets btn btn-primary">Voir vos clients</button>
                            {clients.clients.map(({nom, email}, index) => (
                                <div className="card" style={{ width: 18 + 'em'}} key={nom+email}>
                                    <img src={"logo512.png"} className="card-img-top" alt="ImgProjet" />
                                    <div className="card-body">
                                        <h5 className="card-title">{nom}</h5>
                                        <p className="card-text">{email}</p>
                                    </div>
                                </div>
                            ))}
                        </Link>
                        )}
                    </article>
                </section>
            )}
            
        </div>

    );
};
export default TableauBord;