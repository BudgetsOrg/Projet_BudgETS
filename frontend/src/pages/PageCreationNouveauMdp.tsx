import { postResetPassword } from "../api/UtilisateurApi";
/*
Cette classe permet d'afficher la page qui changera le mot de passe de l'utilisateur.
 */
function PageCreationNouveauMdp() {
    const reinitializationMdp = async () => {
        /* On Prend le token qui est stocké dans l'url et avec ce token on peut get l'utilisateur afin de changer son password
        avec le nouveau que l'utilisateur insère.
        Très important le token qui est dans le lien dure 15 minutes donc après 15 secondes on pourra plus get l'utilisateur
        correspondant au token ou changer son mot de passe.
        */
        const token = new URLSearchParams(window.location.search).get("token") ?? "";
        const password = (document.getElementById("input_nouveau_mdp") as HTMLInputElement).value;


        try {
            const reponse = await postResetPassword(token,password);
            if (!reponse.ok) {
                const errorData = await reponse.json();
                const message = Array.isArray(errorData.message)
                    ? errorData.message.join(', ')
                    : errorData.message;
                throw new Error(message || "Erreur lors de la connexion");
            }
            const data = await reponse.json();
            console.log("Mot de passe changé ");
            window.location.href = "/";
        } catch (error : any) {
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