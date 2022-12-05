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
                        <Link to="/nouveau-projet" className="btn btn-primary">Créer un projet</Link>
                    </section>) : (<>
                        <Link to="/nouveau-projet" className="btn btn-primary">Créer un projet</Link>
                        <div className="list-group">
                            <h1>Vos projets</h1>
                            {projet.map(({ nom, description, color, date, id, membres, client}) => (
                                <Link to={`/projets/${id}`} className="list-group-item list-group-item-action flex-column align-items-start" style={{ border: `2px solid ${color}`, borderRadius: '5px' }} key={nom + color}>
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1">{nom}</h5>
                                        <small><i>{date}</i></small>
                                    </div>
                                    <p className="mb-1">{description}</p>
                                    {membres.map(({nom, id})=>(
                                        <small key={id}>{nom}; </small> 
                                    ))}
                                    {client.map(({nom, id})=>(
                                        <small key={id} style={{float: 'right'}}>{nom}</small> 
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
                                <Link to={`/projets/collaboration/${id}`} className="list-group-item list-group-item-action flex-column align-items-start" style={{ border: `2px solid ${color}`, borderRadius: '5px' }} key={nom + color}>
                                    <div className="d-flex w-100 justify-content-between">
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