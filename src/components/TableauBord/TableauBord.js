import { useState, useContext, useEffect } from "react";
import { onSnapshot, collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { authContexte } from "../../Contexte/authContexte";
import { Link } from "react-router-dom";

const TableauBord = () =>{
    const ctx = useContext(authContexte);
    const [projet, setProjet] = useState([]);
    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'projets'), (snapshot) => {
            setProjet(snapshot.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                };
            }));
        });
        return unsub;
    }, []);

    return(
        <section style={{marginTop:50+'px'}}>
            {projet.map((projet)=>(
                <div className="card" style={{width:18+'em'}} key={projet.nom + projet.url}>
                    <img src={"logo512.png" }className="card-img-top" alt="ImgProjet"/>
                    <div className="card-body">
                        <h5 className="card-title">{projet.nom}</h5>
                        <p className="card-text">{projet.description}</p>
                        <p className="card-text">{projet.client}</p>
                        <Link to="" className="btn btn-primary">Go somewhere</Link>
                    </div>
                </div>
            ))}
        </section>
    );
};
export default TableauBord;