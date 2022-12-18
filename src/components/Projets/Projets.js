import { useState, useContext, useEffect } from "react";
import { onSnapshot, collection, addDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { authContexte } from "../../Contexte/authContexte";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Spinner from "../Spinner/Spinner";

const Projets = () => {
    const ctx = useContext(authContexte);
    const [projet, setProjets] = useState([]);
    const [projetAdded, setProjetAdded] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

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
    }, [projet.length]);

    useEffect(() => {
        const getProjet = async () => {
            const unsub = onSnapshot(collection(db, "membres", ctx.user.uid, "added"), (snapshot) => {
                setProjetAdded(
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
    }, [projetAdded.length]);

    return (
        <>
            {isLoading ? (<Spinner />) : (
                <section className='Projets'>
                    {projet.length === 0 ? (<section className="SectionVide">
                        <h1>Vous avez 0 projet!</h1>
                        <Link to="/nouveau-projet" className="btn ">Créer un projet</Link>
                    </section>) : (<>
                            <Link to="/nouveau-projet" className="btn ">Créer un projet</Link>
                        <div className="list-group">
                            <h1>Vos projets</h1>
                            {projet.map(({ nom, description, color, date, id, membres, client, dateLivrable}) => (
                                <Link to={`/projets/${id}`} className="list-group-item list-group-item-action flex-column align-items-start unProjet" style={{ borderRadius: '5px'}} key={nom + color}>
                                    
                                    <div className="d-flex w-100 justify-content-between">

                                        <div className="titreProjet">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={color} className="bi bi-file-earmark-fill" viewBox="0 0 16 16">
                                        <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z"/>
                                        </svg>
                                        <h5 className="mb-1">{nom}</h5>
                                        </div>
                                        <small><i>{date}</i></small>
                                    </div>
                                    <small>Due: <i>{dateLivrable}</i></small>
                                    <p className="mb-1 descrip"><i>{description}</i></p>
                                    {membres.map(({nom, id})=>(
                                        <small key={id}>Membre(s): {nom}, </small> 
                                    ))}
                                    {client.map(({nom, id})=>(
                                        <small key={id} style={{float: 'right'}}>Client: {nom}</small> 
                                    ))}
                                </Link>
                                
                            ))}
                        </div>
                    </>)}

                    <div className="list-group">    
                    {projetAdded.length === 0 ? (
                        <h1>vous n'avez pas de projet auquel vous êtes ajoutés</h1>
                        ) : (<><h1>Projets où vous avez été rajouté</h1>

                            {projetAdded.map(({nom, color, id, date, description}) => (
                                <Link to={`/projets/collaboration/${id}`} className="list-group-item list-group-item-action flex-column align-items-start unProjetAdded" style={{borderRadius: '5px' }} key={nom + color}>
                                    <div className="d-flex w-100 justify-content-between">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={color} className="bi bi-file-earmark-fill" viewBox="0 0 16 16">
                                        <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z"/>
                                        </svg>
                                        <h5 className="mb-1">{nom}</h5>
                                        <small><i>{date}</i></small>
                                    </div>
                                    <p className="mb-1">{description}</p>
                                </Link>
                                
                                ))}
                            
                            </>)}
                    </div>
                </section>
            )}
        </>
    )
};
export default Projets;