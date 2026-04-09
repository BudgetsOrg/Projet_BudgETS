import { postResetPassword } from "../api/UtilisateurApi";

function PageCreationNouveauMdp() {
    const reinitializationMdp = async () => {
        const token = new URLSearchParams(window.location.search).get("token") ?? "";
        const password = (document.getElementById("input_nouveau_mdp") as HTMLInputElement).value;


        alert("On rentre dans la fonction : "+ password);
        try {
            const reponse = await postResetPassword(token,password);
            if (!reponse.ok) {
                alert("On rentre dans l'erreur")
                const errorData = await reponse.json();
                const message = Array.isArray(errorData.message)
                    ? errorData.message.join(', ')
                    : errorData.message;
                throw new Error(message || "Erreur lors de la connexion");
            }
            alert("On est apres le message d'erreur.")
            const data = await reponse.json();
            alert("Mot de passe changé : "+ data) // Plus tard creer un pop up au lieux du alert.
            console.log("Mot de passe changé : " , data);
            window.location.href = "/";
        } catch (error : any) {
            alert("On rentre dans l'erreur ");
            console.error(error)
            return;
        }
    }

    return (
        <>
            <div className="container_mdp_oublie">
                <h1>Mot de passe oublié</h1>
                <label> Veuillez créer un nouveau mot de passe et, cette fois-ci, ne l'oubliez pas. </label>
                <input type="password" id="input_nouveau_mdp" placeholder="Nouveau mot de passe "></input>
                <button onClick={reinitializationMdp}>Confirmer</button>


                <div className="triangle_page_mdp_oublie triangle_droite_page_mdp_oublie" />
                <div className="triangle_page_mdp_oublie triangle_gauche_page_mdp_oublie" />

            </div>

        </>)
}
export default PageCreationNouveauMdp;