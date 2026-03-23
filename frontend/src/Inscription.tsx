//Mohamed
// Page d'inscription pour les nouveaux utilisateurs

function Inscription() {
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

        <div className="avatar_options">
          <img src="" className="avatar_option" />
          <img src="" className="avatar_option" />
          <img src="" className="avatar_option" />
          <img src="" className="avatar_option" />
        </div>

        <form className="form_vertical">
          <div className="form_horizontal">
            <input type="text" name="btn_nom" placeholder="Nom" />
            <input type="text" name="btn_prenom" placeholder="Prénom" />
          </div>
          <div className="form_horizontal">
            <label className="text_date_naissance">Date de naissance : </label>
            <input type="date" name="btn_date_naissance" placeholder="AAAA/MM/JJ"/>
          </div>
          <input type="email" name="btn_email" placeholder="Adresse email" />
          <input type="password" name="btn_password" placeholder="Mot de passe" />
          <label>Quel est votre solde de ce mois :</label>
          <input type="number" name="btn_solde" placeholder="Solde du mois" />
          <div className="image_container">
            <img src="/img/image_inscription_plante_coupe.png" className="image_btn_inscription"/>
            <button className="btn_overlay" type="submit">S'inscrire</button>
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