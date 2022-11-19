import { useState, useContext, useEffect } from "react";
import { onSnapshot, collection, addDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { authContexte } from "../../Contexte/authContexte";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Spinner from "../Spinner/Spinner";

const TableauBord = () =>{
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

    const testNav = (index) => {
        navigate('/accueil/'+index);
    };

    return(
        <div>
            {isLoading ? (<Spinner/>) : (
            <section className="Accueil" style={{marginTop:50+'px'}}>
                {projet.projets.map(({nom, description, color}, index)=>(
                    <div className="card" style={{width: 18+'em', border: `2px solid ${color}`}} key={nom + color}>
                        <img src={"logo512.png" }className="card-img-top" alt="ImgProjet"/>
                        <div className="card-body">
                            <h5 className="card-title">{nom}</h5>
                            <p className="card-text">{description}</p>
                            <Link to="" className="btn btn-primary">Voir Projet</Link>
                            <Link to={testNav(index)} className="btn btn-primary">Modifier le Projet</Link>
                        </div>
                    </div>
                ))}
            </section>)}
            <section><Outlet/></section>
        </div>
        
    );
};
export default TableauBord;