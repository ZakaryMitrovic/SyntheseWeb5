import { useState, useContext, useEffect } from "react";
import { onSnapshot, collection, doc, addDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { authContexte } from "../../Contexte/authContexte";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from 'react-router-dom';

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
        client: {}
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
        const unsub = onSnapshot(collection(db, 'clients'), (snapshot) => {
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

    const SubmitForm = async (e) => {
        e.preventDefault();

        const projetRef = collection(db, "membres", ctx.user.uid, "projets");

        await addDoc(projetRef, {
            nom: newProjet.nom,
            description: newProjet.description,
            color: newProjet.color,
            date: "Créé le "+showTime
        }, { merge: true });


        console.log("it works");
        navigate('/projets');
    };

    const CheckMembres = async (e, membreId, nomMembre, emailMembre) => {
        const { checked, value } = e.currentTarget;
        setSelected(
            prev => checked
                ? [...prev, value]
                : prev.filter(val => val !== value)
        );

        //FIX THIS
        const membrePourAjout = { [membreId]: membreId, nom: nomMembre, email: emailMembre };
        newProjet.membres.map((membre) => {
            membrePourAjout.push({ [membreId]: membre.id, nom: membre.nom, email: membre.email })
        })
        console.log(membrePourAjout);

    };



    return (
        <section>
            {isLoading ? <Spinner /> : (
                <form style={{ marginTop: 50 + 'px' }} noValidate onSubmit={(e) => SubmitForm(e)}>
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

                        {/* <div className="checkboxMembres">
                        <p>Contacts:</p>
                       {contact.contacts.map((membre)=>(
                        <div className="form-check form-switch" key={membre.nom + membre.email}>
                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={(e)=>CheckMembres(e, e.target.value, membre.nom, membre.email)} value={membre.id} checked={selected.some(val => val === membre.id)}/>
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{membre.nom}</label>
                        </div>  
                       ))}
                    </div> */}

                        {/* Pour les clients */}

                        {/* <div className="selectClient">
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Ajouter un Client</label>
                        <select className="form-select form-select-sm" aria-label=".form-select-sm example">
                            <option defaultValue>Pas de Client</option>
                            <option value="1">Client1</option>
                            <option value="1">Client2</option>
                            <option value="1">Client3</option>
                        </select>
                    </div> */}

                    </div>
                    <button className="btn btn-primary btnProjet" type="submit">Créer votre projet!</button>
                </form>)}
        </section>
    );
};
export default CreerProjets;