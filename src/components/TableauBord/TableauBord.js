import { useState, useContext, useEffect } from "react";
import { onSnapshot, collection, addDoc, doc, getDoc, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { authContexte } from "../../Contexte/authContexte";
import { Link } from "react-router-dom";
import Spinner from "../Spinner/Spinner";

const TableauBord = () => {
    const ctx = useContext(authContexte);
    const [projet, setProjets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [contacts, setContacts] = useState([]);
    const [clients, setClients] = useState([]);

    /*POUR LES PROJETS */
    useEffect(() => {
        const getProjet = async () => {
            const unsub = onSnapshot(query(collection(db, "membres", ctx.user.uid, "projets"), orderBy("dateLivrable"), limit(5)), (snapshot) => {
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
    }, [projet.length]);
    
    /*POUR LES CONTACTS */
    useEffect(() => {

      const getContacts = async() => {
          const docRef = doc(db, 'membres', ctx.user.uid);
  
          const monDoc = await getDoc(docRef);
  
          const monProjet = monDoc.data();
          
          setContacts({
              ...monProjet,
              id: monDoc.id
          });
          setIsLoading(false);
      };
      getContacts();
      console.log(contacts.contacts);
  }, [ctx.user.uid]);
  
      /*POUR LES CLIENTS */
      useEffect(() => {
        const getClient = async () => {
            const unsub = onSnapshot(collection(db, "membres", ctx.user.uid, "clients"), (snapshot) => {
                setClients(
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
          getClient();
    }, [clients.length]);

    return (
        <div className="bodyAccueil" >
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
                                <button className="btnLinkProjets btn">Voir les projets</button>
                                {projet.map(({ nom, description, color, date, id,dateLivrable }) => (
                                    <div className="card" style={{ width: 18 + 'em', border: `2px solid black` }} key={id}>
                                        <img src={"monkey.png"} className="card-img-top" alt="ImgProjet" />
                                        <div className="card-body">
                                            <div className="Name">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={color} class="bi bi-file-earmark-fill" viewBox="0 0 16 16">
                                                <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z"/>
                                                </svg>
                                                <h5 className="card-title">{nom}</h5>
                                            </div>
                                            <small><i>{date}</i></small>
                                            <div>
                                            <small>Due: <i>{dateLivrable}</i></small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Link>
                        </section>
                    )}
                    <article>
                            <Link to='/membres' className="list-group-item-action flex-column align-items-start ListMembres">
                                <button className="btnLinkProjets btn btn-primary">Vos contacts</button>
                                {contacts.length != 0 ? (<>
                                {contacts.contacts.length != 0 ? (<>
                                {contacts.contacts.map(({nom, email, photoURL, id}) => (
                                  <div className="Membre">
                                    <div className="d-flex w-100 justify-content-between">
                                        <small><img src={photoURL} alt={nom} style={{height: "50px", borderRadius: "10px"}}referrerPolicy="no-referrer"/></small>
                                        <h5 >{nom}</h5>
                                        <small ><i>{email}</i></small>
                                    </div>
                                  </div>
                                    
                                ))}
                                </>):(<p className="pCreerProjetAccueil">Vous avez 0 contacts!</p>)}
                                </>): (<p className="pCreerProjetAccueil">Vous avez 0 contacts!</p>)}
                            </Link>
                        {clients.length === 0 ? (<Link to='/creerclient' className="ListClients">
                        <button className="btnLinkProjets btn btn-primary">Ajouter votre premier client!</button>
                        <p className="pCreerProjetAccueil">Vous avez 0 client!</p>    
                        </Link>) : (
                            <Link to='/clients' className="ListClients">
                            <button className="btnLinkProjets btn btn-primary">Voir vos clients</button>
                            {clients.map(({nom, email, id}) => (
                                <div className="card" style={{ width: 18 + 'em', border: `2px solid black`}} key={id}>
                                    <img src={"monkeyFlip.png"} className="card-img-top" alt="ImgProjet" />
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