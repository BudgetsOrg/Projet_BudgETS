//Mohamed
// Page d'inscription pour les nouveaux utilisateurs
// Dans le cas ou le significateur soit un , alors le transformer en .
import { useState} from "react";
import type { Utilisateur }  from "../interfaces";
import { postUtilisateur } from "../api/UtilisateurApi";
import { setToken, getToken } from "../../public/token";
import img_retour from "../../public/img/arrow_left_alt.png";
/*interface Utilisateur {
  nom: string;
  prenom: string;
  dateNaissance: "";
  email: string;
  telephone?:string;
  password: string;
  solde ?: number;
}
  */
const bdUtilisateurs: Utilisateur[] = [];


function Inscription() {
  const [donneeInscription, setDonneeInscription] = useState<Utilisateur>({nom : "", prenom : "",adresse_email : "",  password : "", date_naissance : "",soldeDumois:0});
/* const stockerUtilisateur = (e: React.FormEvent) => {
  e.preventDefault(); 
  const nomUtilisateur = (document.getElementsByName("btn_nom")[0] as HTMLInputElement).value
  const prenomUtilisateur = (document.getElementsByName("btn_prenom")[0] as HTMLInputElement).value
  const dateNaissanceUtilisateur = (document.getElementsByName("btn_date_naissance")[0] as HTMLInputElement).value
  const emailUtilisateur = (document.getElementsByName("btn_email")[0] as HTMLInputElement).value
  const passwordUtilisateur = (document.getElementsByName("btn_password")[0] as HTMLInputElement).value
  const soldeUtilisateur = parseFloat(
    (document.getElementsByName("btn_solde")[0] as HTMLInputElement).value.replace(",", ".")
  );

  const nouvelUtilisateur: Utilisateur = {
    nom: nomUtilisateur,
    prenom: (document.getElementsByName("btn_prenom")[0] as HTMLInputElement).value,
    dateNaissance: (document.getElementsByName("btn_date_naissance")[0] as HTMLInputElement).value,
    email: (document.getElementsByName("btn_email")[0] as HTMLInputElement).value,
    password: (document.getElementsByName("btn_password")[0] as HTMLInputElement).value,
    solde: parseFloat(
      (document.getElementsByName("btn_solde")[0] as HTMLInputElement).value.replace(",", ".")
    )
  };

  bdUtilisateurs.push(nouvelUtilisateur);

  console.log("Ajouté :", nouvelUtilisateur);
  console.log("BD :", bdUtilisateurs);
};
*/
const retourPageConnexion = () => {
  window.location.href = "/PageConnexion";
}

const viderChamps = () => {
  setDonneeInscription({
    nom: "",
    prenom: "",
    adresse_email:"",
    password:"",
    date_naissance:"",
    soldeDumois: 0
  });
}
const gererEntreeUtilisateur = (event: React.ChangeEvent<HTMLInputElement>) => {
  const id = event.target.id;
  let value: string | number | Date = event.target.value;

  if (id === "soldeDumois") {
    const parsed = parseFloat(value.replace(",", "."));
    value = isNaN(parsed) ? 0 : parsed;
    console.log("Solde converssion de , en .");
  }
  setDonneeInscription({
    ...donneeInscription,
    [id]: value
  });
};
const stockerUtilisateur =  async (event: React.SubmitEvent<HTMLFormElement>) => {
event.preventDefault();


    try {
      const reponse = await postUtilisateur(donneeInscription);


try {
    const reponse = await postUtilisateur(donneeInscription);

    if (!reponse.ok) {
    const errorData = await reponse.json();
    const message = Array.isArray(errorData.message) 
        ? errorData.message.join(', ') 
        : errorData.message;
    throw new Error(message || "Erreur lors de l'inscription");
}
    const data = await reponse.json();
    console.log("Utilisateur créé :", data);
    alert(`Utilisateur crée voila le token : ${data.access_token}`);
    //setToken(data.access_token);
    

    alert(`L'utilisateur ${donneeInscription.prenom} ${donneeInscription.nom} a été ajouté.(message après fetch)`);
    
    viderChamps();
    window.location.href = "/PageConnexion";

  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
}

  return (
    <>

      <div className="main_inscription">
        <h1>Inscription</h1>
        <p className="sous-titre">Remplissez les informations suivantes :</p>

        <img 
          src="/img/image_avatar_default.png" 
          id="avatar_default" 
          className="avatar_default" 
        />

        {/*}<div className="avatar_options">
          <img src="" className="avatar_option" />
          <img src="" className="avatar_option" />
          <img src="" className="avatar_option" />
          <img src="" className="avatar_option" />
        </div>{*/}

        <form className="form_vertical" onSubmit={stockerUtilisateur} >
          <div className="form_horizontal">
            <input type="text" id="nom" placeholder="Nom" value={donneeInscription.nom} onChange={gererEntreeUtilisateur}/>
            <input type="text" id="prenom" placeholder="Prénom" value={donneeInscription.prenom} onChange={gererEntreeUtilisateur}/>
          </div>
          <div className="form_horizontal">
            <label className="date">Date de naissance : </label>
            <input type="date" id="date_naissance" placeholder="AAAA/MM/JJ" value={donneeInscription.date_naissance} onChange={gererEntreeUtilisateur}/>
          </div>
          <input type="email" id="adresse_email" placeholder="Adresse email" value={donneeInscription.adresse_email} onChange={gererEntreeUtilisateur}/>
          <input type="password" id="password" placeholder="Mot de passe" value={donneeInscription.password} onChange={gererEntreeUtilisateur}/>
          <label>Quel est votre solde de ce mois :</label>
          <input type="number" id="soldeDumois" placeholder="Solde du mois" value={donneeInscription.soldeDumois ?? ""} onChange={gererEntreeUtilisateur}/>
          
          <div className="image_container">
            <img src="/img/image_inscription_plante_coupe.png" className="image_btn_inscription"/>
            <div className="container_retour_inscription" onClick={retourPageConnexion}>
              <img className="img_retour_overlay_inscription" src={img_retour}></img>
              <p className="text_overlay_inscription">retour en arrière</p>
            </div>
            <button className="btn_overlay_inscription">S'inscrire</button>
          </div>
        </form>
        
        <div className="triangle triangle-droite"/>
        <div className="triangle triangle-gauche"/>

        <div className="triangle-animee triangle1"/>
        <div className="triangle-animee triangle2"/>
      </div>


    </>
  );
}

export default Inscription;