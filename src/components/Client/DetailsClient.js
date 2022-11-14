
import { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const DetailsClient = () =>{

    const [ClientDetails, setClientDetails] = useState(null);
    const params = useParams();


    useEffect(() => {

        const getClient = async() => {
            const docRef = doc(db, 'clients', params.clientId);

            const monDoc = await getDoc(docRef);

            const monClient = monDoc.data();
            
            setClientDetails({
                ...monClient,
                id: monDoc.id
            });
        };
        getClient();
    }, [params.clientId]);

console.log(ClientDetails);
   
    return(
        <div>

        <h2>{ClientDetails.nom}</h2>
        <p> {ClientDetails.email} </p>
        <button>Supprimer</button>

        </div>
        
    );
};
export default DetailsClient;