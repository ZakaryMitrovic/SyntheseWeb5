import { useEffect, useState, useContext } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {doc, getDoc, setDoc, arrayUnion, addDoc} from "firebase/firestore";
import {ref, update, getDatabase} from "firebase/database";
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
            const docRef = doc(db, 'membres', ctx.user.uid, "projets", params.projetId);

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

        const projetData = {
            nom: projetDetails.nom,
            description: projetDetails.description,
            color: projetDetails.color,
            date: "Modifier le " + showTime
        };

        await setDoc(doc(db, 'membres', ctx.user.uid, "projets", params.projetId), projetData);
        
        navigate('/projets');
        
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
                    {/* Couleur du Projet */}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">Couleur du projet</span>
                        <input type="color" onChange={(e) => updateProjet(e.target.value, 'color')} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={projetDetails.color}/>
                    </div>

                    {/* Titre du Projet */}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">Nom du Projet</span>
                        <input type="text" onChange={(e) => updateProjet(e.target.value, 'nom')} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={projetDetails.nom}/>
                    </div>
        
                    {/* Description du Projet */}
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Description du Projet</label>
                        <textarea onChange={(e) => updateProjet(e.target.value, 'description')} className="form-control" id="exampleFormControlTextarea1" rows="3" value={projetDetails.description}></textarea>
                    </div>
                
                </div>
                <button className="btn btn-primary btnProjet" type="submit">Confirmer</button>
            </form>
        </section>
        )
    )
};
export default ModifierProjets;