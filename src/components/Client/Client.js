import { useState, useContext, useEffect } from "react";
import { onSnapshot, collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import {Outlet } from 'react-router-dom';
import {Link} from 'react-router-dom';

const Clients = () =>{
    const [isLoading, setIsLoading] = useState(true);
    const [client, setClient] = useState([]);
    
    // Pour reçevoir l'information des clients
    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'clients'), (snapshot) => {
            setClient(snapshot.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                };
            }));
            setIsLoading(false);
        });
        return unsub;
    }, []);

    
    return(
        <>
        <section>
        {client.map(({nom,email, id}) => (


            <div key={id} className="card"  style={{width:18+'em'}}>
            <img src={"logo192.png" } className="card-img-top" alt="..."/>
            <div className="card-body">
            <h5 className="card-title"> {nom} </h5>
            <p className="card-text"> {email} </p>
            
            <Link to={`/clients/${id}`}><button className="btn btn-primary" >Modifier client</button></Link>
            </div>
            </div>
                   
        ))}
       

        </section>
        <div><Outlet/></div>
        </>  
    );
};
export default Clients;