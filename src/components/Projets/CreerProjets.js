import { useState, useContext, useEffect } from "react";
import { onSnapshot, collection, doc, addDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { authContexte } from "../../Contexte/authContexte";
import Spinner from "../Spinner/Spinner";
import { useNavigate, Link } from 'react-router-dom';

const CreerProjets = () => {
    const navigate = useNavigate();
    const ctx = useContext(authContexte);
    const [contact, setContact] = useState([]);
    const [client, setClient] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newProjet, setNewProjet] = useState({
        description: '',
        nom: '',
        color: '#000000',
        membres: [],
        client: -1
    });
    const [selected, setSelected] = useState([]);

    //Pour recevoir la date actuel (jj/mm/aaaa)
    const current = new Date();
    const showTime = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

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

    const updateProjet = (texte, prop) => {
        setNewProjet(current => {
            return {
                ...current,
                [prop]: texte
            };
        });
    };
    console.log(newProjet)

    const SubmitForm = async (e) => {
        e.preventDefault();

        const Membre = contact.contacts.filter((user)=>selected.includes(user.id));
        if(newProjet.client !== -1){
            const Client = client.filter((user)=>newProjet.client.includes(user.id));
            const projetRef = collection(db, "membres", ctx.user.uid, "projets");
    
            const Projet = await addDoc(projetRef, {
                nom: newProjet.nom,
                description: newProjet.description,
                color: newProjet.color,
                date: "Créé le "+showTime,
                membres: Membre,
                client: Client,
                admin: true,
                adminId:ctx.user.uid
            }, { merge: true });
            
            Membre.map((contact)=>{
                const addedRef = doc(db, "membres", contact.id, "added", Projet.id);
                const ProjetAdded = setDoc(addedRef, {
                nom: newProjet.nom,
                color: newProjet.color,
                adminID: ctx.user.uid,
                admin: false
                },{ merge: true });
            });
            navigate('/projets');
        }else{
            const projetRef = collection(db, "membres", ctx.user.uid, "projets");
            const Projet = await addDoc(projetRef, {
                nom: newProjet.nom,
                description: newProjet.description,
                color: newProjet.color,
                date: "Créé le "+showTime,
                membres: Membre,
                client: [],
                admin: true,
                adminId: ctx.user.uid
            }, { merge: true });

            Membre.map((contact)=>{
                const addedRef = doc(db, "membres", contact.id, "projets", Projet.id);
                const ProjetAdded = setDoc(addedRef, {
                nom: newProjet.nom,
                color: newProjet.color,
                adminID: ctx.user.uid,
                admin: false
                },{ merge: true });
            });
            navigate('/projets');
        }
    };
    const CheckMembres = async (e) => {
        const { checked, value } = e.currentTarget;
        setSelected(prev => checked ? [...prev, value] : prev.filter(val => val !== value));

    };


    console.log(newProjet.client)
    return (
        <section>
            {isLoading ? <Spinner /> : (
                <form style={{ marginTop: 50 + 'px' }} noValidate onSubmit={(e) => SubmitForm(e)}>
                    <div className="">
                        {/* Couleur du Projet */}
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Couleur du projet</span>
                            <input type="color" onChange={(e) => updateProjet(e.target.value, 'color')} className="ColorForm" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={newProjet.color} />
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
                        {client.length < 1 ? (<div className="selectClient">
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Ajouter un Client</label><br/>
                        <Link to="/clients" className="btn btn-primary">Veuillez créer un client</Link>
                        </div>) : (<div className="selectClient">
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Ajouter un Client</label>
                        <select onChange={(e)=>updateProjet(e.target.value, 'client')} className="form-select form-select-sm" aria-label=".form-select-sm example" defaultValue>
                        <option defaultValue value={-1}>Pas de Client</option>
                            {client.map(({nom, email,id }, index)=>(
                                <option value={id} key={id}>{nom}, {email}</option>
                            ))}
                        </select>
                        </div>)}

                    </div>
                    <button className="btn btn-primary btnProjet" type="submit">Créer votre projet!</button>
                </form>)}
        </section>
    );
};
export default CreerProjets;