import { useNavigate, Link, useParams, Outlet } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import {doc, getDoc, setDoc, arrayUnion, addDoc, onSnapshot, collection, orderBy, query, Timestamp} from "firebase/firestore";
import { db } from "../../config/firebase";
import { authContexte } from '../../Contexte/authContexte';
import Spinner from "../Spinner/Spinner";
import moment from "moment";

const DetailsAjouter = () =>{
    const ctx = useContext(authContexte);
    const params = useParams();
    const navigate = useNavigate();
    const [projetDetails, setProjetDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState();
    const [isPosts, setIsPosts] = useState([]);

    const current = new Date();

    // récuperer le projet selectionné 
    useEffect(() => {

        const getProjet = async() => {
            const docRef = doc(db, 'membres', ctx.user.uid, "added", params.projetId);

            const monDoc = await getDoc(docRef);

            const monProjet = monDoc.data();
            
            setProjetDetails({
                ...monProjet,
                id: monDoc.id
            });
            setIsLoading(false);
        };
        getProjet();
    }, [params.projetId]);

    // Pour Clavardage
    useEffect(() => {
        const queryChat = query(collection(db, 'membres', ctx.user.uid, "added", params.projetId, "chat"), orderBy("temps", "desc"));
        const unsub = onSnapshot(queryChat, (snapshot) => {
            const unpost = snapshot.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                };
            });
            setIsPosts(unpost);
        });
        return unsub; 
    },[posts]);

    const submitHandler = async(e) => {
        e.preventDefault();

        //faire une condition si tes l'admin
        const postsMembreRef = collection(db, "membres", ctx.user.uid, "added", params.projetId, "chat");
        const postsAdded = addDoc(postsMembreRef, {
            auteur: ctx.user.displayName,
            texte: posts,
            temps: Timestamp.fromDate(current)
        }, { merge: true });
        
        console.log(postsAdded.id);
            const postRef = collection(db, "membres", projetDetails.adminID, "projets", params.projetId, "chat");
            const Post = addDoc(postRef, {
            auteur: ctx.user.displayName,
            texte: posts,
            temps: Timestamp.fromDate(current)
        }, { merge: true });
        
    };

    const updatePost = (valeur) => {
        setPosts(valeur);
    };

return(
    <section>
        {isLoading ? (<Spinner />) : (
            <>
                <section className='ProjetsDetails' style={{ border: `2px solid ${projetDetails.color}` }}>
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{projetDetails.nom}</h5>
                        <small><i>{projetDetails.date}</i></small>
                    </div>
                    <p className="mb-1">{projetDetails.description}</p>
                </section>
                
                {/* Section pour clavardage */}
                <section>
                <h1>Chat</h1>
                     <form onSubmit={submitHandler} name="monForm" noValidate>
                         <div className="form-group">
                             <label htmlFor="text">Votre message</label>
                             <textarea className="form-control" id="text" onChange={e => updatePost(e.target.value)} required></textarea>
                         </div>
                       
                         <input onClick={submitHandler} type="submit" value="Ajouter" className='btn btn-primary'/>
                     </form>
                    <ul>
                        {isPosts?.map((unpost)=> (
                        
                            <li className="post" key={unpost.id}>
                            <blockquote>
                               <p> {unpost.texte} </p>
                            </blockquote>
                                <p>{unpost.auteur} <small><i>{moment(unpost.temps.toDate()).format('dddd, h:mm a')} </i></small></p>
                            </li>

                        ))}

                    </ul>
                </section>
            </>
            )}
    </section>
)
};
export default DetailsAjouter;