import { useNavigate, Link, useParams, Outlet } from 'react-router-dom';

const DetailsProjets = () =>{
    const params = useParams();
return(
    <section>
        <div>
        <Link className="btn btn-primary" to={`/projets/${params.projetId}/modifier`}>Modifier le Projet</Link>
            <section>
            <Outlet/>
            </section>
        </div>
        <section style={{marginTop: 50 +'px'}}>
            lol
        </section>
    </section>
)
};
export default DetailsProjets;