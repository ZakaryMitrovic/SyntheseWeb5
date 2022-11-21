import { useState,  useEffect, useContext } from "react";
import { onSnapshot, collection, doc, deleteDoc, arrayUnion, setDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../config/firebase';
import {Outlet } from 'react-router-dom';
import {Link, useNavigate} from 'react-router-dom';
import { authContexte } from "../../Contexte/authContexte";

const Clients = () =>{
    const [client, setClient] = useState([]);
    const navigate = useNavigate();
    const ctx = useContext(authContexte);
    
   
    
    // Pour reçevoir l'information des clients

    useEffect(() => {
        const getClient = async () => {
            const unsub = onSnapshot(collection(db, "membres", ctx.user.uid, "clients"), (snapshot) => {
                setClient(
                snapshot.docs.map((doc) => {
                  return {
                    ...doc.data(),
                    id: doc.id,
                  };
                })
              );
              
            });
            return unsub;
          };
          getClient();
    }, [client.length]);
   
    
    
      
    

  const deleteHandler = async (index) => {
    const clientRef = doc(db, "membres", ctx.user.uid, "clients", index);
    
    await deleteDoc(clientRef, {
        nom: client.nom,
        email: client.email
    }, { merge: true });
    
    navigate('/clients');
    
  };

  
    
    return(
        client.length == 0 ? (null) : (
        <div>
        <section>
        {client.map(({nom,email, id}) => (


            <div  className="card"  style={{width:18+'em'}}>
            <img src={"logo192.png" } className="card-img-top" alt="..."/>
            <div className="card-body">
            <h5 className="card-title"> {nom} </h5>
            <p className="card-text"> {email} </p>
            
            <Link to={`/clients/${id}`}><button className="btn btn-primary" >Modifier client</button></Link>
            <button className="btn btn-primary" onClick={()=>deleteHandler(id)}  >Supprimer</button>
            </div>
            </div>
                   
        ))}
       
        </section>
        <div><Outlet/></div>
        </div>  
        )
    );
};
export default Clients;