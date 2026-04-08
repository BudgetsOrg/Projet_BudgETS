import { useState } from "react";
import { postUtilisateur } from "../api/UtilisateurApi";
import type { Utilisateur } from "../interfaces";

export default function usePostUtilisateur() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const connexionUtilisateur = async (nouvelleUtilisateur: Utilisateur) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await postUtilisateur(nouvelleUtilisateur);

      if (!response.ok) {
        throw new Error("Erreur lors de la connexion");
      }

      const data = await response.json();
      setSuccess(true);
      return data;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { connexionUtilisateur, loading, error, success };
}
