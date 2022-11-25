import { useEffect, useState, useContext } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import { onSnapshot, collection, doc, setDoc, getDoc} from 'firebase/firestore';
import {ref, update, getDatabase} from "firebase/database";
import { db } from "../../config/firebase";
import { authContexte } from "../../Contexte/authContexte";
import { ref as sRef } from 'firebase/storage';

const ModifierProjets = () => {
    const ctx = useContext(authContexte);
    const [projetDetails, setProjetDetails] = useState(null);
    const [contact, setContact] = useState([]);
    const [client, setClient] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const navigate = useNavigate();
    const [newProjet, setNewProjet] = useState({
        description: '',
        nom: '',
        color: '#000000',
        membres: [],
        client: {}
    });
    const [selected, setSelected] = useState([]);

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

        // Pour reçevoir l'information des membres
        useEffect(() => {
            const unsub = onSnapshot(doc(db, 'membres', ctx.user.uid), (snapshot) => {
                // console.log(snapshot.data());
                setContact({
                    ...snapshot.data(),
                    id: snapshot.id
                })
                setIsLoading(false);
            });
            return unsub;
        }, []);


        // Pour reçevoir l'information des clients
        useEffect(() => {
         const unsub = onSnapshot(collection(db, 'membres', ctx.user.uid, 'clients'), (snapshot) => {
             setClient(snapshot.docs.map(doc => {
                 return {
                     ...doc.data(),
                     id: doc.id
                 };
             }));
         });
         return unsub;
         }, []);
        

    // const submitHandler = async(e) => {
    //     e.preventDefault();

    //     const projetData = {
    //         nom: projetDetails.nom,
    //         description: projetDetails.description,
    //         color: projetDetails.color,
    //         date: "Modifier le " + showTime,
    //         membres: Membre,
    //         client: Client
    //     };

    //     await setDoc(doc(db, 'membres', ctx.user.uid, "projets", params.projetId), projetData);
        
    //     navigate('/projets');
        
    // };

    const SubmitForm = async (e) => {
        e.preventDefault();

        const Membre = contact.contacts.filter((user)=>selected.includes(user.id));
        const Client = client.filter((user)=>newProjet.client.includes(user.id));

        const projetData = collection(db, "membres", ctx.user.uid, "projets");

        const Projet = await setDoc(projetData, {
            nom: newProjet.nom,
            description: newProjet.description,
            color: newProjet.color,
            date: "Créé le "+showTime,
            membres: Membre,
            client: Client
        }, { merge: true });

        navigate('/projets');
    };

    const CheckMembres = async (e) => {
        const { checked, value } = e.currentTarget;
        setSelected(prev => checked ? [...prev, value] : prev.filter(val => val !== value));

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
            
            <form style={{marginTop:50+'px'}} noValidate onSubmit={SubmitForm} >
                <div className="">
                        {/* Couleur du Projet */}
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Couleur du projet</span>
                            <input type="color" onChange={(e) => updateProjet(e.target.value, 'color')} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={newProjet.color} />
                        </div>

                        {/* Titre du Projet */}
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Nom du Projet</span>
                            <input type="text" onChange={(e) => updateProjet(e.target.value, 'nom')} className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={newProjet.nom} />
                        </div>

                        {/* Description du Projet */}
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlTextarea1" className="form-label">Description du Projet</label>
                            <textarea onChange={(e) => updateProjet(e.target.value, 'description')} className="form-control" id="exampleFormControlTextarea1" rows="3" value={newProjet.description}></textarea>
                        </div>
                    </div>

                    <div className="formDroit">

                        {/* Pour les membres */}

                        <div className="checkboxMembres">
                        <p>Contacts:</p>
                       {contact.contacts.map((membre)=>(
                        <div className="form-check form-switch" key={membre.nom + membre.email}>
                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={(e)=>CheckMembres(e)} value={membre.id} checked={selected.some(val => val === membre.id)}/>
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{membre.nom}</label>
                        </div>  
                       ))}
                    </div>

                        {/* Pour les clients */}

                        <div className="selectClient">
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Ajouter un Client</label>
                        <select onChange={(e)=>updateProjet(e.target.value, 'client')} className="form-select form-select-sm" aria-label=".form-select-sm example">
                            <option defaultValue>Pas de Client</option>
                            {client.map(({nom, email,id }, index)=>(
                                <option value={id} key={id}>{nom}, {email}</option>
                            ))}
                        </select>
                    </div>

                    </div>
                    <button className="btn btn-primary btnProjet" type="submit">Modifier votre projet!</button>
            </form>
        </section>
        )
    )
};
export default ModifierProjets;