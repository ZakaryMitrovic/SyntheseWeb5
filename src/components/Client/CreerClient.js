import { useState, useContext, useEffect } from "react";
import { onSnapshot, collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { authContexte } from "../../Contexte/authContexte";
import Spinner from "../Spinner/Spinner";

const CreerClient = () =>{
    const [isLoading, setIsLoading] = useState(true);
    const [client, setClient] = useState([]);
    
    // Pour reçevoir l'information des clients
    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'clients'), (snapshot) => {
            setClient(snapshot.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                };
            }));
            setIsLoading(false);
        });
        return unsub;
    }, []);


    const SubmitForm = async (e) => {
        e.preventDefault();
        console.log("it works");
    };
    
    return(
        <section>
            {isLoading ? <Spinner/> : (
            <form style={{marginTop:50+'px'}} noValidate onSubmit={(e)=>SubmitForm(e)}>
                <div>
                    {/* Nom du client */}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">Nom du client</span>
                        <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
                    {/* Email du client */}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">Email du client</span>
                        <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
        
                
                </div>
                <button className="btn btn-primary btnProjet" type="submit">Ajouter Client</button>
            </form>)}
        </section>
    );
};
export default CreerClient;