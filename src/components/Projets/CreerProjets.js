import { useState, useContext, useEffect } from "react";
import { onSnapshot, collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { authContexte } from "../../Contexte/authContexte";
import Spinner from "../Spinner/Spinner";

const CreerProjets = () =>{
    const ctx = useContext(authContexte);
    const [contact, setContact] = useState([]);
    const [client, setClient] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Pour reçevoir l'information des membres
    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'contact'), (snapshot) => {
            setContact(snapshot.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                };
            }));
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


    const SubmitForm = async (e) => {
        e.preventDefault();
        console.log("it works");
    };
    
    return(
        <section>
            {isLoading ? <Spinner/> : (
            <form style={{marginTop:50+'px'}} noValidate onSubmit={(e)=>SubmitForm(e)}>
                <div className="">
                    {/* Titre du Projet */}
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-default">Nom du Projet</span>
                        <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
                    </div>
        
                    {/* Description du Projet */}
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlTextarea1" className="form-label">Description du Projet</label>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>
                </div>
    
                <div className="formDroit">
    
                    {/* Pour les membres */}
                    <div className="checkboxMembres">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                            <label class="form-check-label" for="flexSwitchCheckDefault">membre</label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                            <label class="form-check-label" for="flexSwitchCheckDefault">membre</label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                            <label class="form-check-label" for="flexSwitchCheckDefault">membre</label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                            <label class="form-check-label" for="flexSwitchCheckDefault">membre</label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                            <label class="form-check-label" for="flexSwitchCheckDefault">membre</label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                            <label class="form-check-label" for="flexSwitchCheckDefault">membre</label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                            <label class="form-check-label" for="flexSwitchCheckDefault">membre</label>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault"/>
                            <label class="form-check-label" for="flexSwitchCheckDefault">membre</label>
                        </div>
                    </div>

                    {/* Pour les clients */}
                    <div className="selectClient">
                        <select className="form-select form-select-sm" aria-label=".form-select-sm example">
                            <option defaultValue>Ajouter un client?</option>
                            <option value="1">Client1</option>
                        </select>
                    </div>
                </div>
                <button className="btn btn-primary btnProjet" type="submit">Button</button>
            </form>)}
        </section>
    );
};
export default CreerProjets;