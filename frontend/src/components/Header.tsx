// Mohamed


function Header() {

const redirigerPageConnexion = () => {
    window.location.href = "/PageConnexion";
}
const redirigerPageAcceuil = () => {
/**
 * Pour l'instant on rediriger vers la page principale mais a changer plus tard pour rediriger vers la page d'acceuil.
 */
    window.location.href = "/PagePrincipale";
}

    return (
        <div className="container_header">
            <ul className="sous-sujet">

                <div className="left">
                    <li className="sous_sujet"><img src="/img/image_inscription_plante.png" className="image_header" onClick={redirigerPageAcceuil}></img></li>
                    <li className="sous_sujet"><a className="sous_sujet" href="/PageConnexion">PageConnexion</a></li>
                    <li className="sous_sujet"><a className="sous_sujet" href="/PagePrincipale">PagePrincipale</a></li>
                    <li className="sous_sujet"><a className="sous_sujet" href="/PageEnveloppe">PageEnveloppe</a></li>
                </div>
                <div className="right">
                    <li className="sous_sujet"><button className="btn_connexion_header" type="submit" onClick={redirigerPageConnexion}>Connexion</button></li>
                </div>
            </ul>
        </div>
        
    )
}
export default Header;