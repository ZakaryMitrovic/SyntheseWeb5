import { useState, useContext } from "react";
import {addDoc, arrayUnion, collection, doc, setDoc} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { authContexte } from "../../Contexte/authContexte";

const CreerClient = () =>{
   
    const ctx = useContext(authContexte);
    const navigate = useNavigate();
    
    
    const [newClients, setNewClients] = useState({
        nom: '',
        email: ''
    });


    const updateClients = (texte, prop) => {
        setNewClients(current => {
            return {
                ...current,
                [prop]: texte
            };
        });
    };

    const submitHandler = async(e) => {
        e.preventDefault();

        // Ajouter un client

        const membreRef = collection(db, "membres", ctx.user.uid, "clients");
        await addDoc(membreRef, {
            nom: newClients.nom,
            email: newClients.email
        }, { merge: true });

        navigate('/clients');
    };

    const isDisabled = newClients.nom.trim() === '';
    
    return(
        <section>
            
            <form style={{marginTop:50+'px'}} noValidate onSubmit={(e)=>submitHandler(e)}>
                <div>
                    {/* Nom du client */}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">Nom du client</span>
                        <input onChange={(e) => updateClients(e.target.value, 'nom')} value={newClients.nom} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
                    {/* Email du client */}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">Email du client</span>
                        <input onChange={(e) => updateClients(e.target.value, 'email')} value={newClients.email} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
        
                
                </div>
                <button disabled={isDisabled} className="btn  btnProjet" type="submit">Ajouter Client</button>
            </form>
        </section>
    );
};
export default CreerClient;