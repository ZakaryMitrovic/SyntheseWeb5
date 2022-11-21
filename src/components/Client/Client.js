import { useState,  useEffect, useContext } from "react";
import { onSnapshot, collection, doc, deleteDoc } from 'firebase/firestore';
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

        const unsub = onSnapshot(doc(db, 'membres', ctx.user.uid), (snapshot) => {

            setClient({
                ...snapshot.data(),
                id: snapshot.id
            })
        });
        return unsub;
        
    }, [client.length]);
    
    
      
    

  const deleteHandler = async (id) => {
    await deleteDoc(doc(db, "clients" , id))
    navigate('/clients');
  };

    
    return(
        client.length == 0 ? (null) : (
        <div>
        <section>
        {client.clients.map(({nom,email, id}) => (


            <div key={id+nom} className="card"  style={{width:18+'em'}}>
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