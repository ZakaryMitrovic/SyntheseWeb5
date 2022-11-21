import { useState, useContext, useEffect } from "react";
import {
  onSnapshot,
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { authContexte } from "../../Contexte/authContexte";
import { Link, Outlet } from "react-router-dom";
import Spinner from "../Spinner/Spinner";


const Membres = () => {
  const ctx = useContext(authContexte);
  const [membres, setMembres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

    console.log(membres.email);

    setIsLoading(false);
  };

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <ul className="list-group">
          {membres.map((membre, id) => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={membre.nom + membre.email}>
              <img className="imgMembresList" src={`${membre.photoURL}`} alt="photoMembre" />
              {membre.nom} <p>{membre.email}</p>
              <span className="badges">{membre.projets.length}</span>
              <span className="material-symbols-outlined" onClick={(e) => AddContact(e, membre)}>add</span>
            </li>
          ))}
        </ul>
      )}
      <section>
        <Outlet />
      </section>
    </div>
  );
};
export default Membres;
