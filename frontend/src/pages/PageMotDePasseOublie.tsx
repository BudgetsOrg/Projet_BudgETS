import { postForgotPassword } from "../api/UtilisateurApi";

export function PageMotDePasseOublie() {
    const envoyerMailResetPassword = async () => {
        const email = (document.getElementById("input_adresse_email") as HTMLInputElement ).value;
        alert("On rentre dans la fonction.")
     try {
         const reponse = await postForgotPassword(email);
         if(!reponse.ok){
            alert("On rentre dans l'erreur")
           const errorData = await reponse.json();
           const message = Array.isArray(errorData.message)
           ? errorData.message.join(', ')
           : errorData.message;
           throw new Error(message || "Erreur lors de la connexion");
         }
         alert("On est apres le message d'erreur.")
        const data = await reponse.json();

        alert("Mail Envoyé ") // Plus tard creer un pop up au lieux du alert.
        console.log("Mail envoyé");
       } catch (error) {
        alert("On entre dans l'erreur.")
        console.log(error);
         alert("L'utilisateur avec le mail : "+ email + " n'existe pas");
         return;
       }
       window.location.href = "/"   
    }
    return (

    <>
    <div className="container_mdp_oublie">
        <h1>Mot de passe oublié</h1>
        <label>Entrez votre email vous  recevrais un message qui vous permettra de changer votre mot de passe actuel avec un nouveau </label>
        <input id="input_adresse_email" placeholder="Adresse email"></input>
        <button onClick={envoyerMailResetPassword}>envoyé</button>

        
        <div className="triangle_page_mdp_oublie triangle_droite_page_mdp_oublie"/>
        <div className="triangle_page_mdp_oublie triangle_gauche_page_mdp_oublie"/>
        
    </div>

    </>)
}
export default PageMotDePasseOublie;