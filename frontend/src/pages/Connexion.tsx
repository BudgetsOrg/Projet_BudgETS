// Mohamed
function Connexion() {

    
const redirigerPageInscription = () => {
    window.location.href = "/PageInscription";
}
    return (
        <>
        <div className="page_connexion">
            <div className="connexion_container">
                <div className="container_gauche">
                    <img src="/img/image_inscription_plante.png" className="image_connexion"/>
                </div>
                <div className="connexion_information">
                    <h1>Connexion</h1>
                    <input type="email" name="btn_email" placeholder="Adresse email" />
                    <input type="password" name="btn_password" placeholder="Mot de passe" />
                    <label>Mot de passe oublié ?</label>
                    <button className="btn_connexion" type="submit">Connexion</button>
                    <button className="btn_inscription" type="submit" onClick={redirigerPageInscription}>S'inscrire</button>

                    
                </div>

                
                <div className="triangle triangle-droite"/>
                <div className="triangle triangle-gauche"/>

            </div>
        </div>
        </>
    );
}
export default Connexion;