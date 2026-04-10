import type { Utilisateur } from "../../interfaces";
import SuppressionCompte from "../../popups/SuppressionPopup/SuppressionCompte";
import React, { useState } from "react";
import { deleteUtilisateur, updateUtilisateur } from "../../api/UtilisateurApi";

interface TableInfoProfilProps {
  user: Utilisateur;
}

export function TableInfoProfil({ user }: TableInfoProfilProps) {
  const [showSuppressionPopup, setShowSuppressionPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const closeEditMode = () => setEditMode(false);
  const openEditMode = () => setEditMode(true);

  const formattedTelephone = user.telephone
    ? `${user.telephone.slice(0, 3)}-${user.telephone.slice(3, 6)}-${user.telephone.slice(6, 10)}`
    : "";

  const handleChangeProfil = async () => {
    try {
      const nom = (document.getElementById("nom") as HTMLInputElement).value;
      const prenom = (document.getElementById("prenom") as HTMLInputElement)
        .value;
      const telephone = (
        document.getElementById("telephone") as HTMLInputElement
      ).value;
      const date_naissance = (
        document.getElementById("date_naissance") as HTMLInputElement
      ).value;
      console.log("Données à envoyer:", {
        nom,
        prenom,
        telephone,
        date_naissance,
      });
      await updateUtilisateur(nom, prenom, telephone, date_naissance);
      closeEditMode();
    } catch (error) {
      console.log("Erreur changer utilisateur:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUtilisateur();
    } catch (error) {
      console.log("Erreur suppression utilisateur:", error);
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
              <input id="nom" defaultValue={user.nom} readOnly={!editMode} />
            </td>
            <td className="font-semibold p-4">
              <label htmlFor="prenom">Prenom:</label>
            </td>
            <td>
              <input
                id="prenom"
                defaultValue={user.prenom}
                readOnly={!editMode}
              />
            </td>
          </tr>
          <tr>
            <td className="font-semibold p-4" colSpan={2}>
              <label htmlFor="date_naissance">Date de naissance:</label>
            </td>
            <td>
              <input
                id="date_naissance"
                defaultValue={user.date_naissance}
                readOnly={!editMode}
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
                defaultValue={formattedTelephone}
                readOnly={!editMode}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {!editMode && (
        <div className="flex items-center justify-center p-4">
          <button
            onClick={openEditMode}
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
            Arrêter le mode modification
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
          onDelete={() => {
            console.warn("Suppression de compte non implémentée");
          }}
        />
      </div>
    </div>
  );
}
