import { useState, useContext, useEffect } from "react";
import { onSnapshot, collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { authContexte } from "../../Contexte/authContexte";
import { Link } from "react-router-dom";

const Membres = () =>{
    const ctx = useContext(authContexte);
    const [membres, setMembres] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'membres'), (snapshot) => {
            setMembres(snapshot.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                };
            }));
        });
        return unsub;
    }, []);
    {console.log(membres)}
 return(
    <ul className="list-group">
        {membres.map((membre)=>(
            <li className="list-group-item d-flex justify-content-between align-items-center" key={membre.nom + membre.email}>
                {membre.nom} <p>{membre.email}</p>
                <span className="badges">14</span>
            </li>
        ))}
    </ul>
 );
};
export default Membres;