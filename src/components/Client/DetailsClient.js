
import { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {doc, getDoc, setDoc} from "firebase/firestore";
import { db } from "../../config/firebase";

const DetailsClient = () =>{

    const [ClientDetails, setClientDetails] = useState(null);
    const params = useParams();
    const navigate = useNavigate();


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

    
    const submitHandler = async(e) => {
        e.preventDefault();

        // Modifier le client 
        const docRef = doc(db, 'clients', params.clientId);
        
        await setDoc(docRef, {
       
                nom: ClientDetails.nom,
                email: ClientDetails.email
           
        }, {merge: true});

        navigate('/clients');
        
    };

    const updateClients = (texte, prop) => {
        setClientDetails(current => {
            return {
                ...current,
                [prop]: texte
            };
        });
    };
    

    return(
        ClientDetails == null ? (null) : (
          
            <section>
            
            <form style={{marginTop:50+'px'}} noValidate onSubmit={submitHandler} >
                <div>
                    {/* Nom du client */}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">Nom du client</span>
                        <input onChange={(e) => updateClients(e.target.value, 'nom')} value={ClientDetails.nom} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
                    {/* Email du client */}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">Email du client</span>
                        <input  onChange={(e) => updateClients(e.target.value, 'email')} value={ClientDetails.email}  type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
        
                
                </div>
                <button className="btn btn-primary btnProjet" type="submit">Confirmer</button>
            </form>
        </section>
        )
      
        
    );
};
export default DetailsClient;