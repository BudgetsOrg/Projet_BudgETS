// Mohamed
import { getUtilisateur } from "../../api/UtilisateurApi";
import { useState, useEffect } from "react";
import { getToken, viderSessionStorage } from "../../../public/token";

import DropDownProfile from "./DropDownProfile";
import type { Utilisateur } from "../../interfaces";


//Cette classe permet d'afficher l'en tête et elle s'adapte pour afficher ce 
//qu'elle doit afficher au bon moment et dépendamment de si un Utilisateur est connecté.
function Header() {
  const token = getToken();

  // Permet de faire en sorte que si un utilisateur est connecté le btn Connexion passe à un Slider qui afficher
  // certaines informations comme le Nom,Prenom,Mail,Photo de profil de l'utilisateur 
  // et le slider permet de se diriger vers la page Profil ou de se déconnecter.
  const estConnecte = token !== "";
  const [openProfile, setOpenProfile] = useState(false);

  const [utilisateurCourant, setUtilisateurCourant] =
    useState<Utilisateur | null>(null);
  useEffect(() => {
    const recupererUtilisateurCourant = async () => {
      try {
        const monUtilisateur = await getUtilisateur();
        setUtilisateurCourant(monUtilisateur);
      } catch (error: any) {
        console.log("Erreur pour acceder à l'utilisateur :", error);
      }
    };
    recupererUtilisateurCourant();
  }, []);

  const redirigerPageConnexion = () => {
    window.location.href = "/PageConnexion";
  };
  const redirigerPageAcceuil = () => {
    window.location.href = "/";
  };

  return (
    <div className="container_header">
      <ul className="sous-sujet">
        {/* LEFT */}
        <li className="left">
          <ul>
            <li className="sous_sujet">
              <img
                src="/favicon.io"
                className="image_header"
                onClick={redirigerPageAcceuil}
              />
            </li>
            {estConnecte ? (
              <li className="sous_sujet">
                <a href="/PagePrincipale">Page Principale</a>
              </li>
            ) : null}{" "}
            {/* Lorsqu'on aura fini de faire la page catégorie et de relier au backend on rendra visible cette partie.
            {estConnecte ? <li className="sous_sujet">
              <a href="/CategoriesDeDepense">Catégories de dépense</a>
            </li> : null}
            */}
            <li className="sous_sujet">
              <a href="/EducationFinanciere">Éducation financière</a>
            </li>
          </ul>
        </li>

        {/* Droite Affichage Profil ou Btn Connexion */}
        <li className="right">
          {estConnecte ? (
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setOpenProfile(true)}
              onMouseLeave={() => setOpenProfile(false)}
            >
              <span
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "white",
                  padding: "8px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>
                    {utilisateurCourant?.prenom} {utilisateurCourant?.nom}
                  </span>
                  <span style={{ fontSize: "12px", color: "lightgray" }}>
                    {utilisateurCourant?.adresse_email}
                  </span>{" "}
                  {/* ← ici */}
                </div>
                <div
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    backgroundColor: "#2d7a4f",
                    flexShrink: 0,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {utilisateurCourant?.image ? (
                    <img
                      src={utilisateurCourant.image}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : null}
                </div>
              </span>{" "}
              {openProfile && (
                <DropDownProfile utilisateurCourant={utilisateurCourant} />
              )}
            </div>
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
