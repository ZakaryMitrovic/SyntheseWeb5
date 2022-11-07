import { useState, useContext, useEffect } from "react";
import { onSnapshot, collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { authContexte } from "../../Contexte/authContexte";
import Spinner from "../Spinner/Spinner";

const DetailsClient = () =>{
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

    console.log(client.nom);


    const SubmitForm = async (e) => {
        e.preventDefault();
        console.log("it works");
    };
    
    return(
        <section>
        
        <div className="card"  style={{width:18+'em'}}>
        <img src="..." className="card-img-top" alt="..."/>
        <div className="card-body">
        <h5 className="card-title">Card title</h5>
        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <a href="#" className="btn btn-primary">Go somewhere</a>
        </div>
        </div>

        </section>
    );
};
export default DetailsClient;