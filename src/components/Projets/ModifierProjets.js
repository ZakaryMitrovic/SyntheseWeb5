import { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {doc, getDoc, setDoc} from "firebase/firestore";
import { db } from "../../config/firebase";

const ModifierProjets = () => {
    const [projetDetails, setProjetDetails] = useState(null);
    const params = useParams();
    const navigate = useNavigate();


    useEffect(() => {

        const getProjet = async() => {
            const docRef = doc(db, 'projets', params.idProjet);

            const monDoc = await getDoc(docRef);

            const monProjet = monDoc.data();
            
            setProjetDetails({
                ...monProjet,
                id: monDoc.id
            });
        };
        getProjet();
    }, [params.idProjet]);

    console.log(params.idProjet);
    
    const submitHandler = async(e) => {
        e.preventDefault();

        // Modifier le client 
        const docRef = doc(db, 'projets', params.idProjet);
        
        await setDoc(docRef, {
       
            nom: projetDetails.nom,
            description: projetDetails.description,
            color: projetDetails.color
           
        }, {merge: true});

        navigate('/accueil');
        
    };

    const updateProjet = (texte, prop) => {
        setProjetDetails(current => {
            return {
                ...current,
                [prop]: texte
            };
        });
    };
    

    return(
        projetDetails == null ? (null) : (
          
            <section>
            
            <form style={{marginTop:50+'px'}} noValidate onSubmit={submitHandler} >
                <div>
                    {/* Nom du client */}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">Nom du client</span>
                        <input onChange={(e) => updateProjet(e.target.value, 'nom')} value={projetDetails.nom} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
                    {/* Email du client */}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">Email du client</span>
                        <input  onChange={(e) => updateProjet(e.target.value, 'email')} value={projetDetails.email}  type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
        
                
                </div>
                <button className="btn btn-primary btnProjet" type="submit">Confirmer</button>
            </form>
        </section>
        )
    )
};
export default ModifierProjets;