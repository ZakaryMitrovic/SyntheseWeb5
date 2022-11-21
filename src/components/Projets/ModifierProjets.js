import { useEffect, useState, useContext } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {doc, getDoc, setDoc, arrayUnion, addDoc} from "firebase/firestore";
import {ref, update} from "firebase/database";
import { db } from "../../config/firebase";
import { authContexte } from "../../Contexte/authContexte";
import { ref as sRef } from 'firebase/storage';

const ModifierProjets = () => {
    const ctx = useContext(authContexte);
    const [projetDetails, setProjetDetails] = useState(null);
    const params = useParams();
    const navigate = useNavigate();
    const [newProjet, setNewProjet] = useState({
        description: '',
        nom: '',
        color: '#000000',
        membres: [],
        client: {}
    });

    //Pour recevoir la date actuel (jj/mm/aaaa)
    const current = new Date();
    const showTime = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;

    useEffect(() => {

        const getProjet = async() => {
            const docRef = doc(db, 'projets', params.projetId);

            const monDoc = await getDoc(docRef);

            const monProjet = monDoc.data();
            
            setProjetDetails({
                ...monProjet,
                id: monDoc.id
            });
        };
        getProjet();
    }, [params.projetId]);
    
    const submitHandler = async(e) => {
        e.preventDefault();

        // Modifier le projet 

        //db, "membres/"+ctx.user.uid+"/projects/"+params.projetId

        const membreRef = doc(db,"membres", ctx.user.uid); //Gets document off collection "membres" with uid of user
        await setDoc(doc(db,"membres", ctx.user.uid),
            {
                nom: newProjet.nom,
                description: newProjet.description,
                color: newProjet.color,
                date:"Modifier le: "+ showTime
            },
            { merge: true }
        );
        
        navigate('/projets');
        
    };

    const updateProjet = (texte, prop) => {
        setNewProjet(current => {
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
                    {/* Nom du projet */}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">Nom du projet</span>
                        <input  onChange={(e) => updateProjet(e.target.value, 'nom')} value={projetDetails.nom}  type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
                    {/* description du projet */}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">description du projet</span>
                        <input  onChange={(e) => updateProjet(e.target.value, 'description')} value={projetDetails.email}  type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
                    {/* Couleur du projet */}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">Color du projet</span>
                        <input  onChange={(e) => updateProjet(e.target.value, 'color')} value={projetDetails.email}  type="color" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
        
                
                </div>
                <button className="btn btn-primary btnProjet" type="submit">Confirmer</button>
            </form>
        </section>
        )
    )
};
export default ModifierProjets;