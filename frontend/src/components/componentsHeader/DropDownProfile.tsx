import { useState, useEffect } from "react";
import type { Utilisateur } from "../../interfaces";
import { viderSessionStorage } from "../../../public/token";


//Cette classe permet d'afficher les options de déconnexion et de rediriger vers la page Profil
//contenant les informations de celui-ci.
function DropDownProfile({ utilisateurCourant }: { utilisateurCourant: Utilisateur | null }) {
    const redirigerPageAcceuil = () => {
        window.location.href = "/";
    }
    const redirigerPageProfile = () => {
        window.location.href = "/Profile";
    }
    return (
        <div className="flex flex-col dropDownProfile">
            <ul className="flex flex-col gap-4">
                <li className="option_profile"
                    onClick={redirigerPageProfile}
                    style={{
                        cursor: "pointer",
                        border: "1px solid #7FA75A",
                        borderRadius: "999px",
                        padding: "8px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}
                >
                    <div
                     style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "#7FA75A",
                        flexShrink: 0
                    }} />
                    Profil
                </li>
                <li className="option_deconnexion"
                    onClick={() => {
                        viderSessionStorage();
                        window.location.href = "/";
                    }}
                    style={{
                        cursor: "pointer",
                        border: "1px solid red",
                        borderRadius: "999px",
                        padding: "8px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}
                >
                    <div style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: "red",
                        flexShrink: 0
                    }} />
                    Déconnexion
                </li>
            </ul>
        </div>
    )
}
export default DropDownProfile;