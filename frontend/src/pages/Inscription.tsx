//Mohamed
// Page d'inscription pour les nouveaux utilisateurs
// Dans le cas ou le significateur soit un , alors le transformer en .
import { useState } from "react";
import type { Utilisateur } from "../interfaces";
import { postUtilisateur } from "../api/UtilisateurApi";
import { setToken, getToken } from "../../public/token";
import img_retour from "../img/arrow_left_alt.png";
import img_plante from "../img/image_inscription_plante_coupe.png";
import img_avatar_default from "../img/image_avatar_default.png";



/*
Cette classe permet à l'utilisateur de se créer un compte et vérifie si les entrées sont valide pour pouvoir 
les inserer dans la base de données.
*/
function Inscription() {
  const [erreur, setErreur] = useState<string | null>(null);
  const [donneeInscription, setDonneeInscription] = useState<Utilisateur>({
    nom: "",
    prenom: "",
    adresse_email: "",
    password: "",
    date_naissance: "",
    soldeDumois: "" as any,
  });
  const retourPageConnexion = () => {
    window.location.href = "/PageConnexion";
  };

  const viderChamps = () => {
    setDonneeInscription({
      nom: "",
      prenom: "",
      adresse_email: "",
      password: "",
      date_naissance: "",
      soldeDumois: 0,
    });
  };
  const gererEntreeUtilisateur = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const id = event.target.id;

    const valeurBrute = event.target.value;

    let value: any = valeurBrute;
if (id === "soldeDumois") {
    // Si l'utilisateur efface tout, on garde une chaîne vide
    if (valeurBrute === "") {
      value = "";
    } else {
      // On remplace la virgule par un point et on convertit en nombre
      const parsed = parseFloat(valeurBrute.replace(",", "."));
      value = isNaN(parsed) ? "" : parsed;
    }
  }
    setDonneeInscription({
      ...donneeInscription,
      [id]: value,
    });
  };
  const stockerUtilisateur = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();



    setErreur(null);

    if ((donneeInscription.soldeDumois || 0) <= 0) {
    setErreur("Le solde du mois doit être supérieur à 0.");
    return;
  }

  if (!donneeInscription.nom  || !donneeInscription.prenom || !donneeInscription.adresse_email || !donneeInscription.password || !donneeInscription.date_naissance) {
    setErreur("Veuillez remplir tous les champs obligatoires.");
    return;
  }
  //Vérification de l'âge legal soit de 18 ans.
    if (donneeInscription.date_naissance) {
        const aujourdhui = new Date();
        const dateNaissance = new Date(donneeInscription.date_naissance);
        
        let age = aujourdhui.getFullYear() - dateNaissance.getFullYear();
        const mois = aujourdhui.getMonth() - dateNaissance.getMonth();
        
        if (mois < 0 || (mois === 0 && aujourdhui.getDate() < dateNaissance.getDate())) {
            age--;
        }

        if (age < 18) {
            setErreur("Vous devez avoir au moins 18 ans pour vous inscrire.");
            return;
        }
    } else {
        setErreur("Veuillez saisir votre date de naissance.");
        return;
    }
    try {
      const reponse = await postUtilisateur(donneeInscription);

      if (!reponse.ok) {
        const errorData = await reponse.json();
        const message = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message;
        throw new Error(message || "Erreur lors de l'inscription");
      }
      viderChamps();
      window.location.href = "/PageConnexion";
    } catch (error: any) {
      console.error(error);
      setErreur(error.message);
    }
  };

  return (
    <>
      <div className="main_inscription">
        <h1>Inscription</h1>
        {erreur && (
        <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
          {erreur}
        </p>
      )}
        <p className="sous-titre">Remplissez les informations suivantes :</p>

        <img
          src={img_avatar_default}
          id="avatar_default"
          className="avatar_default"
        />

        {/*}<div className="avatar_options">
          <img src="" className="avatar_option" />
          <img src="" className="avatar_option" />
          <img src="" className="avatar_option" />
          <img src="" className="avatar_option" />
        </div>{*/}

        <form className="form_vertical" onSubmit={stockerUtilisateur}>
          <div className="form_horizontal">
            <input
              type="text"
              id="nom"
              placeholder="Nom"
              value={donneeInscription.nom}
              onChange={gererEntreeUtilisateur}
              required
            />
            <input
              type="text"
              id="prenom"
              placeholder="Prénom"
              value={donneeInscription.prenom}
              onChange={gererEntreeUtilisateur}
              required
            />
          </div>
          <div className="form_horizontal">
            <label className="date">Date de naissance : </label>
            <input
              type="date"
              id="date_naissance"
              placeholder="AAAA/MM/JJ"
              value={donneeInscription.date_naissance}
              onChange={gererEntreeUtilisateur}
              required
            />
          </div>
          <input
            type="email"
            id="adresse_email"
            placeholder="Adresse email"
            value={donneeInscription.adresse_email}
            onChange={gererEntreeUtilisateur}
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Mot de passe"
            value={donneeInscription.password}
            onChange={gererEntreeUtilisateur}
            required
          />
          <label>Quel est votre solde de ce mois :</label>
          <input
            type="number"
            id="soldeDumois"
            placeholder="Solde du mois"
            value={donneeInscription.soldeDumois ?? ""}
            onChange={gererEntreeUtilisateur}
            required
          />

          <div className="image_container">
            <img
              src={img_plante}
              className="image_btn_inscription"
            />
            <div
              className="container_retour_inscription"
              onClick={retourPageConnexion}
            >
              <img
                className="img_retour_overlay_inscription"
                src={img_retour}
              ></img>
              <p className="text_overlay_inscription">retour en arrière</p>
            </div>
            <button className="btn_overlay_inscription">S'inscrire</button>
          </div>
        </form>

        <div className="triangle triangle-droite" />
        <div className="triangle triangle-gauche" />

        <div className="triangle-animee triangle1" />
        <div className="triangle-animee triangle2" />
      </div>
    </>
  );
}

export default Inscription;
