import { postForgotPassword } from "../api/UtilisateurApi";
import { useState } from "react";

export function PageMotDePasseOublie() {

    const [erreur, setErreur] = useState<string | null>(null);

    const envoyerMailResetPassword = async () => {
        const email = (document.getElementById("input_adresse_email") as HTMLInputElement).value;

        setErreur(null);
        try {
            const reponse = await postForgotPassword(email);
            if (!reponse.ok) {
            const errorData = await reponse.json();
            const message = Array.isArray(errorData.message)
                ? errorData.message.join(', ')
                : errorData.message;
            
            throw new Error(message || "Erreur lors de la connexion");
        }
            window.location.href = "/"

            console.log("Mail envoyé");
        } catch (error) {
            console.log(error);
            setErreur(`L'utilisateur avec le mail : ${email} n'existe pas`);
            return;
        }
    }
    return (

        <>
            <div className="container_mdp_oublie">
                <h1>Mot de passe oublié</h1>
                <label>Entrez votre email vous  recevrais un message qui vous permettra de changer votre mot de passe actuel avec un nouveau </label>
                <input id="input_adresse_email" placeholder="Adresse email"></input>
                {erreur && (
                    <p style={{ color: "red", fontSize: "0.9rem", marginTop: "5px" }}>
                        {erreur}
                    </p>
                )}
                <button onClick={envoyerMailResetPassword}>envoyé</button>


                <div className="triangle_page_mdp_oublie triangle_droite_page_mdp_oublie" />
                <div className="triangle_page_mdp_oublie triangle_gauche_page_mdp_oublie" />

            </div>

        </>)
}
export default PageMotDePasseOublie;