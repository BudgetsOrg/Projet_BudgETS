// Mohamed

import { getToken, viderLocalStorage } from "../../public/token";
import logo from "../img/image_inscription_plante.png";


function Header() {
const token = getToken(); //Donne "" si non connecte;
const estConnecte = token !== "";

//Fonction permettant de récupérer les informations de l'utilisateur.

const recupererUtilisateurCourant = async () => {
    try {
        
    } catch (error) {
        
    }
}

const redirigerPageConnexion = () => {
    window.location.href = "/PageConnexion";
}
const redirigerPageAcceuil = () => {
/**
 * Pour l'instant on rediriger vers la page principale mais a changer plus tard pour rediriger vers la page d'acceuil.
 */
    window.location.href = "/";
}

  return (
    <div className="container_header">
      <ul className="sous-sujet">

        {/* LEFT */}
        <li className="left">
          <ul>
            <li className="sous_sujet">
              <img
                src={logo}
                className="image_header"
                onClick={redirigerPageAcceuil}
              />
            </li>
            <li className="sous_sujet">
              <a href="/PageObjectifs">PageObjectifs</a>
            </li>
            <li className="sous_sujet">
              <a href="/PagePrincipale">PagePrincipale</a>
            </li>
            <li className="sous_sujet">
              <a href="/PageEnveloppe">PageEnveloppe</a>
            </li>
          </ul>
        </li>

        {/* Droite Affichage Profil ou Btn Connexion */}
        <li className="right">
          {estConnecte ? (
            <ul>
              <li className="sous_sujet">Mon Profil</li>
              <li className="sous_sujet">
                <button
                  onClick={() => {
                    redirigerPageAcceuil();
                    localStorage.removeItem("token");
                    viderLocalStorage();
                    window.location.reload();
                  }}
                >
                  Déconnexion
                </button>
              </li>
            </ul>
          ) : (
            <ul>
              <li className="sous_sujet">
                <button
                  className="btn_connexion_header"
                  onClick={redirigerPageConnexion}
                >
                  Connexion
                </button>
              </li>
            </ul>
          )}
        </li>

      </ul>
    </div>
  );
}
export default Header;