import { useState, useContext, useEffect } from "react";
import { onSnapshot, collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { authContexte } from "../../Contexte/authContexte";
import { Link, Outlet } from "react-router-dom";
import Spinner from "../Spinner/Spinner";

const Membres = () =>{
    const ctx = useContext(authContexte);
    const [membres, setMembres] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getMembre = async() => {
            const unsub = onSnapshot(collection(db, 'membres'), (snapshot) => {
                setMembres(snapshot.docs.map(doc => {
                    return {
                        ...doc.data(),
                        id: doc.id
                    };
                }));
                setIsLoading(false);
            });
            return unsub;
        }; getMembre();
    }, []);


 return(
    <div>
        { isLoading ? (
            <Spinner/>
        ) : (
        <ul className="list-group">
            {membres.map((membre, id)=>(
                <li className="list-group-item d-flex justify-content-between align-items-center" key={membre.nom + membre.email}>
                   {membre.nom} <p>{membre.email}</p>
                   <span className="badges">{/*Mettre nombre de projet ici*/}</span>
                </li>
            ))}
        </ul>
        )}
        <section>
            <Outlet/>
        </section>
    </div>
 );
};
export default Membres;