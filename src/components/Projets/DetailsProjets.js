import { useNavigate, Link, useParams, Outlet } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import {doc, getDoc, setDoc, arrayUnion, addDoc, onSnapshot, collection, query, orderBy} from "firebase/firestore";
import { db } from "../../config/firebase";
import { authContexte } from '../../Contexte/authContexte';
import Spinner from "../Spinner/Spinner";


const DetailsProjets = () =>{
    const ctx = useContext(authContexte);
    const params = useParams();
    const navigate = useNavigate();
    const [projetDetails, setProjetDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState();
    const [isPosts, setIsPosts] = useState([]);

    const current = new Date();
    const showTime = `${current.getHours()}:${current.getMinutes() + 1}:${current.getSeconds()} `;

    const currentDate = new Date();
    const showDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

    // récuperer le projet selectionné 
    useEffect(() => {

        const getProjet = async() => {
            const docRef = doc(db, 'membres', ctx.user.uid, "projets", params.projetId);

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
        const queryChat = query(collection(db, 'membres', ctx.user.uid, "projets", params.projetId, "chat"), orderBy("temps", "desc"));
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

        const postRef = collection(db, "membres", ctx.user.uid, "projets", params.projetId, "chat");
            const Post = await addDoc(postRef, {
                auteur: ctx.user.displayName,
                texte: posts,
                temps: showTime,
                date: showDate
            }, { merge: true });
            
            //pour les membres
            projetDetails.membres.map((membre)=>{
                const postsMembreRef = doc(db, "membres", membre.id, "added", params.projetId, "chat", Post.id);
                const postsAdded =  setDoc(postsMembreRef, {
                    auteur: ctx.user.displayName,
                    texte: posts,
                    temps: showTime,
                    date: showDate
                }, { merge: true });
            });
    };

    const updatePost = (valeur) => {
        setPosts(valeur);
    };

return(
    <section className='ProjetDetailSection'>
        <div>
            <Link className="btn btn-primary" to={`/projets/${params.projetId}/modifier`}>Modifier le Projet</Link>
        </div>
        {isLoading ? (<Spinner />) : (
            <>
                <section className='ProjetsDetails' style={{ border: `2px solid ${projetDetails.color}` }}>
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{projetDetails.nom}</h5>
                        <small><i>{projetDetails.date}</i></small>
                    </div>
                    <p className="mb-1">{projetDetails.description}</p>
                    {projetDetails.membres.map(({nom, id})=>(
                        <small key={id}>{nom}; </small> 
                    ))}
                    {projetDetails.client.map(({nom, id})=>(
                        <small key={id} style={{float: 'right'}}>{nom}</small> 
                    ))}
                    <Outlet/>
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
                                <p>{unpost.auteur} <small>{unpost.temps} <i>{unpost.date}</i></small></p>
                            </li>

                        ))}

                    </ul>
                </section>
            </>
            )}
    </section>
)
};
export default DetailsProjets;