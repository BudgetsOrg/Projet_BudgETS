// Mohamed
import { useState } from "react";
import { getToken, setToken } from "../../public/token";
import type { Utilisateur } from "../interfaces";
import { postConnexion } from "../api/UtilisateurApi";
import img_retour from "../../public/img/arrow_left_alt.png";

function Connexion() {
  const [donneeConnexion, setDonneeConnexion] = useState<Utilisateur>({
    adresse_email: "",
    nom: "",
    prenom: "",
    password: "",
    date_naissance: "",
    soldeDumois: 0,
  });

  const redirigerPageInscription = () => {
    window.location.href = "/PageInscription";
  };
  const redirigerPagePrincipale = async () => {
    const email = (document.getElementById("btn_email") as HTMLInputElement)
      .value;
    const motDePasse = (
      document.getElementById("btn_password") as HTMLInputElement
    ).value;
    alert("Email :" + email + "Password : " + motDePasse);
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
      alert("Utilisateur Connect avec le token : " + data.access_token);
      setToken(data.access_token);
    } catch (error) {
      alert("L'utilisateur avec le mail : " + email + " n'existe pas");
      return;
    }
    window.location.href = "/";
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
            <img
              src="/img/image_inscription_plante.png"
              className="image_connexion"
            />
          </div>
          <div className="connexion_information">
            <h1>Connexion</h1>
            <input type="email" id="btn_email" placeholder="Adresse email" />
            <input
              type="password"
              id="btn_password"
              placeholder="Mot de passe"
            />
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
/*import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adresse_email: email, password: password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard"); // redirect to main page after login
    } else {
      alert("Email ou mot de passe incorrect");
    }
  };
  return (
    <>
      <div className="connexion_container">
        <div className="container_gauche">
          <img
            src="/img/image_inscription_plante.png"
            className="image_connexion"
          />
        </div>
        <div className="connexion_information">
          <h1>Connexion</h1>
          <input
            type="email"
            name="btn_email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="btn_password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Mot de passe oublié ?</label>
          <button className="btn_connexion" type="submit" onClick={handleLogin}>
            Connexion
          </button>
          <button className="btn_inscription" type="submit">
            S'inscrire
          </button>
        </div>

        <div className="triangle triangle-droite" />
        <div className="triangle triangle-gauche" />
      </div>
    </>
  );
}
export default Connexion;
*/
