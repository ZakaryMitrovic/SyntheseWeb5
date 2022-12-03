import { useState, useContext, useEffect } from "react";
import {
  onSnapshot,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  arrayUnion,
  where,
  query,
  getDocs
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { authContexte } from "../../Contexte/authContexte";
import { Link, Outlet } from "react-router-dom";
import Spinner from "../Spinner/Spinner";


const Membres = () => {
  const ctx = useContext(authContexte);
  const [membres, setMembres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [search, setSearch] = useState("");
  const [filteredMembres, setFilteredMembres] = useState([]);

  useEffect(() => {
    const getMembre = async () => {
      const unsub = onSnapshot(collection(db, "membres"), (snapshot) => {
        setMembres(
          snapshot.docs.map((doc) => {
            return {
              ...doc.data(),
              id: doc.id,
            };
          })
        );
        setIsLoading(false);
      });
      return unsub;
    };
    getMembre();
  }, [membres]);

  const AddContact = async (e, membre) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(membre);
    
    const membreRef = doc(db, "membres", ctx.user.uid);
    await setDoc(
        membreRef,
        {
          contacts: arrayUnion({
            nom: membre.nom,
            email: membre.email,
            id: membre.id,
            photoURL: membre.photoURL
          }),
        },
        { merge: true }
    );
    setIsLoading(false);
  };

  const setSearch = async (email) =>{
    const membres = collection(db, "membres");
    const recherche = query(membres, where("email", "==", email));
    const querySnapshot = await getDocs(recherche);
    const membreRechercher = await querySnapshot.docs.map((doc)=>{
      return doc.data();
    });
    
    const MembreTrouver = {
      nom: membreRechercher[0].nom,
      email: membreRechercher[0].email,
      id: membreRechercher[0].id,
      photoURL: membreRechercher[0].photoURL,
    };
    setFilteredMembres([MembreTrouver]);
  };

  return (
    <div>
      <form className="barreRecherche">
        <label htmlFor="inputPassword5" className="form-label"><h1>Rechercher un membre</h1></label>
        <input type="text" className="form-control" placeholder="example@courriel.ca" onChange={(e)=>setSearch(e.target.value)}/>
        <small> <i>Veuillez inscrire le courriel du membre que vous souhaitez rechercher</i> </small>
      </form>
      {isLoading ? (
        <Spinner />
      ) : (
        
        <ul className="list-group">
          {filteredMembres.length != 0 ? (
            <>
            {filteredMembres.map((membre, id) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={membre.nom + membre.email}>
                <img className="imgMembresList" src={`${membre.photoURL}`} alt="photoMembre" referrerPolicy="no-referrer"/>
                {membre.nom} <p>{membre.email}</p>
                <span className="material-symbols-outlined" onClick={(e) => AddContact(e, membre)}>add</span>
              </li>
            ))}
            </>
          ):(null)}   
        </ul>
      )}
      <section>
        <Outlet />
      </section>
    </div>
  );
};
export default Membres;
