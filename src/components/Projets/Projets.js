import { useState, useContext, useEffect } from "react";
import { onSnapshot, collection, addDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { authContexte } from "../../Contexte/authContexte";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Spinner from "../Spinner/Spinner";

const Projets = () => {
    const ctx = useContext(authContexte);
    const [projet, setProjets] = useState([]);
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

    const TEST= ()=>{
        projet.map((projet) =>(
            projet.membres.map((membre)=>(
                console.log(membre.nom)
            ))
        ))
    }
    TEST();
    return (
        <>
            {isLoading ? (<Spinner />) : (
                <section className='Projets'>
                    {projet.length === 0 ? (<section className="SectionVide">
                        <h1>Vous avez 0 projet!</h1>
                        <Link to="/creerprojet" className="btn btn-primary">Créer un projet</Link>
                    </section>) : (<>
                        <Link to="/creerprojet" className="btn btn-primary">Créer un projet</Link>
                        <div className="list-group">
                            {projet.map(({ nom, description, color, date, id, membres}) => (
                                <Link to={`/projets/${id}`} className="list-group-item list-group-item-action flex-column align-items-start" style={{ border: `2px solid ${color}` }} key={nom + color}>
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1">{nom}</h5>
                                        <small><i>{date}</i></small>
                                    </div>
                                    <p className="mb-1">{description}</p>
                                    {membres.map(({nom, email, id})=>(
                                        <small key={id}>{nom}; </small> 
                                    ))}
                                    <small>/ client</small>
                                </Link>
                                
                            ))}
                            <div><Outlet /></div>
                        </div>
                    </>)}

                </section>
            )}
        </>
    )
};
export default Projets;