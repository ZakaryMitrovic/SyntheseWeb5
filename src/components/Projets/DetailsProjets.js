import { useNavigate, Link, useParams, Outlet } from 'react-router-dom';

const DetailsProjets = () =>{
    const params = useParams();
return(
    <section>

        <Link className="btn btn-primary" to={`/modifier/${params.projetId}`}>Modifier le Projet</Link>
        <section>
        <Outlet/>
        </section>
    </section>
)
};
export default DetailsProjets;