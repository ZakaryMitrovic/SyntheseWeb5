import { useState, useContext, useEffect } from "react";
import { onSnapshot, collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { authContexte } from "../../Contexte/authContexte";

const CreerProjets = () =>{
    const ctx = useContext(authContexte);
    const [contact, setContact] = useState([]);
    const [client, setClient] = useState([]);

    // Pour reçevoir l'information des membres
    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'contact'), (snapshot) => {
            setContact(snapshot.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                };
            }));
        });
        return unsub;
    }, []);

    // Pour reçevoir l'information des clients
    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'clients'), (snapshot) => {
            setClient(snapshot.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                };
            }));
        });
        return unsub;
    }, []);
    const SubmitForm = async (e) => {
        e.preventDefault();
        console.log("it works");
    };
    
    return(
        <form style={{marginTop:50+'px'}} noValidate onSubmit={(e)=>SubmitForm(e)}>

            {/* Titre du Projet */}
            <div className="input-group mb-3">
                <span className="input-group-text" id="inputGroup-sizing-default">Nom du Projet</span>
                <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
            </div>

            {/* Description du Projet */}
            <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label">Description du Projet</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>

            {/* Uploader une image pour le projet */}
            <div className="input-group mb-3">
                <input type="file" className="form-control" id="inputGroupFile02"/>
                <button className="input-group-text">Upload</button>
            </div>

            <div className="containerSelect">
                {/* Choisir un membre */}
                
                {/* Choisir un Client */}
                <select className="form-select form-select-sm" aria-label=".form-select-sm example">
                <option defaultValue>Ajouter un client?</option>
                {client.map((client, i)=>(
                    <option value={i}>{client.nom}</option>
                    ))}
                </select>
            </div>
            <button className="btn btn-primary btnProjet" type="submit">Button</button>
        </form>
    );
};
export default CreerProjets;