function PageCreationNouveauMdp () {
    return (
    <>
    <div className="container_mdp_oublie">
        <h1>Mot de passe oublié</h1>
        <label> Veuillez créer un nouveau mot de passe et, cette fois-ci, ne l'oubliez pas. </label>
        <input placeholder="Nouveau mot de passe "></input>
        <button>Confirmer</button>

        
        <div className="triangle_page_mdp_oublie triangle_droite_page_mdp_oublie"/>
        <div className="triangle_page_mdp_oublie triangle_gauche_page_mdp_oublie"/>
        
    </div>

    </>)
}
export default PageCreationNouveauMdp;