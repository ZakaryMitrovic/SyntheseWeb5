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
            <section className='ProjetDetailSection'>
                <section className='ProjetsDetails' style={{ border: `2px solid #FCA620` }}>
               
                    <div className="d-flex w-100 justify-content-between">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={projetDetails.color} className="bi bi-file-earmark-fill" viewBox="0 0 16 16">
                                <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z" />
                            </svg>
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="titreProjetDetail">{projetDetails.nom}</h5>
                                <small>Dû le: <i>{projetDetails.dateLivrable}</i></small>
                            </div>
                    </div>
                    <div>
                        <small>Membre(s): </small>
                        {projetDetails.membres.map(({ nom, id }) => (
                            <small key={id}>{nom}; </small>
                        ))}
                    </div>
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
                            <div className="messagePost">
                               <p> {unpost.texte} </p>
                            </div>
                                <p>{unpost.auteur} <small><i>{moment(unpost.temps.toDate()).format('dddd, h:mm a')} </i></small></p>
                            </li>

                        ))}

                    </ul>
                </section>
                </section>
            </>
            )}
    </section>
)
};
export default DetailsAjouter;