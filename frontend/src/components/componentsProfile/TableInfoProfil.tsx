import type { Utilisateur } from "../../interfaces";
import SuppressionCompte from "../../popups/SuppressionPopup/SuppressionCompte";
import { useState } from "react";
import { deleteUtilisateur, updateUtilisateur } from "../../api/UtilisateurApi";
import { useNavigate } from "react-router-dom";
import { viderSessionStorage } from "../../../public/token";

interface TableInfoProfilProps {
  user: Utilisateur;
  changementUtilisateur: (field: keyof Utilisateur, value: string) => void;
  onRefresh: () => Promise<void>;
}

export function TableInfoProfil({
  user,
  changementUtilisateur,
  onRefresh,
}: TableInfoProfilProps) {
  const [editMode, setEditMode] = useState(false);
  const [showSuppressionPopup, setShowSuppressionPopup] = useState(false);
  const navigate = useNavigate();

  const inputClassName = (isEditing: boolean) =>
    isEditing
      ? "min-w-0 w-full max-w-full border rounded px-2 py-1"
      : "min-w-0 w-full max-w-full border-none outline-none bg-transparent p-0";

  const formatDateForInput = (date: string | undefined | null) => {
    if (!date) return "";

    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    const parsedDate = new Date(date);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().split("T")[0];
    }
    return "";
  };

  const handleChangeProfil = async () => {
    try {
      const telephonePropre = user.telephone
        ? user.telephone.replace(/\D/g, "")
        : "";
      //appeler l'api
      // on veut aucune valeur null
      await updateUtilisateur(
        user.nom || "",
        user.prenom || "",
        telephonePropre,
        user.date_naissance || "",
      );

      await onRefresh(); // Refresh the user data after update
      setEditMode(false);
    } catch (error) {
      console.error("Erreur changer utilisateur:", error);
      alert(
        "Une erreur est survenue lors de la mise à jour du profil. Veuillez réessayer.",
      );
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteUtilisateur();
      console.log("Delete account result:", result);
      navigate("/"); // Redirige vers la page principale après la suppression du compte
      viderSessionStorage(); // Vide le sessionStorage après la suppression du compte
    } catch (error) {
      console.error("Erreur suppression utilisateur:", error);
      alert(
        "Une erreur est survenue lors de la suppression du compte. Veuillez réessayer.",
      );
    }
  };

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-lg">
      <table className="w-full table-fixed break-words">
        <tbody>
          <tr>
            <td className="font-semibold p-4">
              <label htmlFor="nom">Nom:</label>
            </td>
            <td>
              <input
                id="nom"
                value={user.nom}
                onChange={(e) => changementUtilisateur("nom", e.target.value)}
                readOnly={!editMode}
                className={inputClassName(editMode)}
              />
            </td>
            <td className="font-semibold p-4">
              <label htmlFor="prenom">Prenom:</label>
            </td>
            <td>
              <input
                id="prenom"
                value={user.prenom}
                onChange={(e) =>
                  changementUtilisateur("prenom", e.target.value)
                }
                readOnly={!editMode}
                className={inputClassName(editMode)}
              />
            </td>
          </tr>
          <tr>
            <td className="font-semibold p-4" colSpan={2}>
              <label htmlFor="date_naissance">Date de naissance:</label>
            </td>
            <td>
              <input
                type="date"
                id="date_naissance"
                value={formatDateForInput(user.date_naissance)}
                onChange={(e) =>
                  changementUtilisateur("date_naissance", e.target.value)
                }
                readOnly={!editMode}
                className={inputClassName(editMode)}
              />
            </td>
          </tr>
          <tr>
            <td className="font-semibold p-4" colSpan={2}>
              Email
            </td>
            <td colSpan={2}>{user.adresse_email}</td>
          </tr>
          <tr>
            <td className="font-semibold p-4" colSpan={2}>
              <label htmlFor="telephone">Téléphone:</label>
            </td>
            <td>
              <input
                id="telephone"
                value={user.telephone || ""}
                onChange={(e) =>
                  changementUtilisateur("telephone", e.target.value)
                }
                readOnly={!editMode}
                className={inputClassName(editMode)}
              />
            </td>
          </tr>
        </tbody>
      </table>

      {!editMode && (
        <div className="flex items-center justify-center p-4">
          <button
            onClick={() => setEditMode(true)}
            className="confirm-button py-2 px-4 rounded-lg"
          >
            Modifier information
          </button>
        </div>
      )}

      {editMode && (
        <div className="flex items-center justify-center p-4">
          <button
            onClick={handleChangeProfil}
            className="delete-button py-2 px-4 rounded-lg"
          >
            Enregistrer les modifications
          </button>
        </div>
      )}

      <div className="flex items-center justify-center p-4">
        <button
          className="delete-button py-2 px-4 rounded-lg"
          onClick={() => setShowSuppressionPopup(true)}
        >
          Supprimer mon compte
        </button>
      </div>

      <div className="">
        <SuppressionCompte
          showPopup={showSuppressionPopup}
          closePopup={() => setShowSuppressionPopup(false)}
          onDelete={handleDeleteAccount}
        />
      </div>
    </div>
  );
}
