const Projets = () =>{

    const SubmitForm = async (e) => {
        e.preventDefault();
        console.log("it works");
    };

    return(
        <form style={{marginTop:50+'px'}} noValidate onSubmit={(e)=>SubmitForm(e)}>

            {/* Titre du Projet */}
            <div className="input-group mb-3">
                <span className="input-group-text" id="inputGroup-sizing-default">Nom du Projet</span>
                <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"/>
            </div>

            {/* Description du Projet */}
            <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label">Description du Projet</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>

            {/* Uploader une image pour le projet */}
            <div className="input-group mb-3">
                <input type="file" className="form-control" id="inputGroupFile02"/>
                <button className="input-group-text">Upload</button>
            </div>

            <div className="containerSelect">
                {/* Choisir un membre */}
                <select className="form-select form-select-sm" aria-label=".form-select-sm example">
                <option defaultValue>Ajouter un membre?</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
                </select>
                {/* Choisir un Client */}
                <select className="form-select form-select-sm" aria-label=".form-select-sm example">
                <option defaultValue>Ajouter un client?</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
                </select>
            </div>
            <button className="btn btn-primary btnProjet" type="submit">Button</button>
        </form>
    );
};
export default Projets;