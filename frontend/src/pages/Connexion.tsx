import { useState } from "react";
import { setToken } from "../../public/token";
import { postConnexion } from "../api/UtilisateurApi";
import img_retour from "../img/arrow_left_alt.png";
import img_plante from "../img/image_inscription_plante.png";
import { clearSelectedBudgetId } from "../utils/budgetSelection";
import ChangerBudget from "../popups/ChangerBudget";

/*
Cette classe permet à l'utilisateur de 1) se connecter pour avoir accès à plus de fonctionalité
2) donne l'option d'aller vers la page Inscription et 3) aller vers la réinitialization du mot de passe.
*/
function Connexion() {
  const [erreur, setErreur] = useState("");
  const [showPopup, setPopup] = useState(false);

  const redirigerPageInscription = () => {
    window.location.href = "/PageInscription";
  };
  const redirigerPagePrincipale = async () => {
    const email = (document.getElementById("btn_email") as HTMLInputElement)
      .value;
    const motDePasse = (
      document.getElementById("btn_password") as HTMLInputElement
    ).value;
    try {
      const reponse = await postConnexion(email, motDePasse);
      if (!reponse.ok) {
        const errorData = await reponse.json();
        const message = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message;
        throw new Error(message || "Erreur lors de la connexion");
      }
      const data = await reponse.json();
      console.log("Utilisateur connecte");
      setToken(data.access_token);

      const derniereConnexion = new Date(data.derniere_connexion);
      const aujourdhui = new Date();
      const compare = derniereConnexion.getMonth() - aujourdhui.getMonth();
      if (compare < 0) {
        console.log(
          "Nouveau mois détecté, rediriger vers la création de budget",
        );
        setPopup(true);
      } else {
        window.location.href = "/PagePrincipale";
        clearSelectedBudgetId();
      }
    } catch (error) {
      setErreur("L'email ou le mot de passe est incorrect.");
      return;
    }

    //window.location.href = "/PagePrincipale";
  };
  const redirigerMotDePasseOublie = () => {
    window.location.href = "/PageMdpOublie";
  };
  const retourPageAcceuil = () => {
    window.location.href = "/";
  };
  return (
    <>
      <div className="page_connexion">
        <div className="connexion_container">
          <div className="container_gauche">
            <img src={img_plante} className="image_connexion" />
          </div>
          <div className="connexion_information">
            <h1>Connexion</h1>
            <ChangerBudget
              showPopup={showPopup}
              closePopup={() => setPopup(false)}
            />

            <input type="email" id="btn_email" placeholder="Adresse email" />
            <input
              type="password"
              id="btn_password"
              placeholder="Mot de passe"
            />
            {erreur && (
              <div
                style={{
                  backgroundColor: "#ffe0e0",
                  border: "1px solid #ff4d4d",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  color: "#cc0000",
                  fontSize: "14px",
                  width: "458px",
                  textAlign: "center",
                  boxSizing: "border-box",
                }}
              >
                {erreur}
              </div>
            )}
            <label onClick={redirigerMotDePasseOublie}>
              Mot de passe oublié ?
            </label>
            <button
              className="btn_connexion"
              type="submit"
              onClick={redirigerPagePrincipale}
            >
              Connexion
            </button>
            <button
              className="btn_inscription"
              type="submit"
              onClick={redirigerPageInscription}
            >
              S'inscrire
            </button>
            <div className="container_retour" onClick={retourPageAcceuil}>
              <img className="img_retour_overlay" src={img_retour}></img>
              <p className="text_overlay">retour en arrière</p>
            </div>
          </div>

          <div className="triangle triangle-droite" />
          <div className="triangle triangle-gauche" />

          <div className="triangle-animee triangle3" />
          <div className="triangle-animee triangle4" />
        </div>
      </div>
    </>
  );
}
export default Connexion;
