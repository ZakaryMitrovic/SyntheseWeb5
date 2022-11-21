
import { useContext, useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {arrayUnion, doc, getDoc, setDoc} from "firebase/firestore";
import { db } from "../../config/firebase";
import { authContexte } from "../../Contexte/authContexte";

const DetailsClient = () =>{

    const [ClientDetails, setClientDetails] = useState(null);
    const params = useParams();
    const navigate = useNavigate();
    const ctx = useContext(authContexte);


    useEffect(() => {

        const getClient = async() => {
            const docRef = doc(db, 'membres', ctx.user.uid, "clients", params.clientId);

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

        const clientData = {
            nom: ClientDetails.nom,
            email:ClientDetails.email
        };

        await setDoc(doc(db, 'membres', ctx.user.uid, "clients", params.clientId), clientData);
        
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