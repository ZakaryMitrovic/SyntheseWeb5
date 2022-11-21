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
        const unsub = onSnapshot(doc(db, 'membres', ctx.user.uid), (snapshot) => {
            setProjets({
                ...snapshot.data(),
                id: snapshot.id
            })
            setIsLoading(false);
        });
        return unsub;
    }, [projet.length]);

    return (
        <>
            {isLoading ? (<Spinner />) : (
                <section className='Projets'>
                    {projet.projets.length === 0 ? (<section className="SectionVide">
                        <h1>Vous avez 0 projet!</h1>
                        <Link to="/creerprojet" className="btn btn-primary">Créer un projet</Link>
                    </section>) : (<>
                        <Link to="/creerprojet" className="btn btn-primary">Créer un projet</Link>
                        <div className="list-group">
                            {projet.projets.map(({ nom, description, color, date }, id) => (
                                <Link to={`/projets/${id}`} className="list-group-item list-group-item-action flex-column align-items-start" style={{ border: `2px solid ${color}` }} key={nom + color}>
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1">{nom}</h5>
                                        <small>{date}</small>
                                    </div>
                                    <p className="mb-1">{description}</p>
                                    <small>membres </small>
                                    <small>/ client</small>
                                </Link>
                            ))}
                        </div>
                        <div><Outlet /></div>
                    </>)}

                </section>
            )}
        </>
    )
};
export default Projets;