//Mohamed
// Page d'inscription pour les nouveaux utilisateurs
// Dans le cas ou le significateur soit un , alors le transformer en .
import { useState} from "react";
interface Utilisateur {
  nom: string;
  prenom: string;
  dateNaissance: "";
  email: string;
  telephone?:string;
  password: string;
  solde ?: number;
}
const bdUtilisateurs: Utilisateur[] = [];


function Inscription() {
  const [donneeInscription, setDonneeInscription] = useState<Utilisateur>({nom : "", prenom : "", dateNaissance : "", email : "", password : "",solde:undefined});
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

const viderChamps = () => {
  setDonneeInscription({
    nom: "",
    prenom: "",
    dateNaissance:"",
    email:"",
    password:"",
    solde: undefined
  });
}
const gererEntreeUtilisateur = (event: React.ChangeEvent<HTMLInputElement>) => {
  const id = event.target.id;
  let value: string | number = event.target.value;

  if (id === "btn_solde") {
    value = parseFloat(value.replace(",", "."));
  }

  setDonneeInscription({
    ...donneeInscription,
    [id]: value
  });
};
const stockerUtilisateur = (event: React.SubmitEvent<HTMLFormElement>) => {
event.preventDefault();


// Ici on pourrait mettre les champs qui seront necessaire ou pas.
if(donneeInscription.nom == "" || donneeInscription.prenom == "" || donneeInscription.email == "" || donneeInscription.dateNaissance == "" || donneeInscription.password == ""){
  // Pour rendre plus interactif mettre un petit message en dessous des champs auxquelle il manque une informations. Pour préciser ce qui est à mettre.
  if(donneeInscription.nom == ""){
    
  }
  alert("Un des champs n'a pas été rempli")
  return;
}

// On appelle le API pour ajouter un Utilisateur à la bd. ET ICI LORSQU'ON METS LE SOLDE On fait REPLACE(",".".");
alert(`l'utilisateur ${donneeInscription.prenom} ${donneeInscription.nom} été ajouté.`);
console.log()
viderChamps();

// Ensuite on va rediriger vers la page Principale qui montre les différents Objectifs/Enveloppe de l'utilisateur.
window.location.href = "/PageConnexion";
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
            <input type="date" id="dateNaissance" placeholder="AAAA/MM/JJ" value={donneeInscription.dateNaissance} onChange={gererEntreeUtilisateur}/>
          </div>
          <input type="email" id="email" placeholder="Adresse email" value={donneeInscription.email} onChange={gererEntreeUtilisateur}/>
          <input type="password" id="password" placeholder="Mot de passe" value={donneeInscription.password} onChange={gererEntreeUtilisateur}/>
          <label>Quel est votre solde de ce mois :</label>
          <input type="number" id="solde" placeholder="Solde du mois" value={donneeInscription.solde ?? ""} onChange={gererEntreeUtilisateur}/>
          <div className="image_container">
            <img src="/img/image_inscription_plante_coupe.png" className="image_btn_inscription"/>
            <button className="btn_overlay">S'inscrire</button>
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