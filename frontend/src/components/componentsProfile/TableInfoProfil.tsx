import type { User } from "../../interfaces";
import SuppressionCompte from "../../popups/SuppressionPopup/SuppressionCompte";
import React, { useState } from "react";

export function TableInfoProfil(user: User) {
  const [showSuppressionPopup, setShowSuppressionPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const closeEditMode = () => setEditMode(false);
  const openEditMode = () => setEditMode(true);
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
                defaultValue={
                  String(user.date_naissance.getDate()) +
                  "/" +
                  String(user.date_naissance.getMonth() + 1) +
                  "/" +
                  String(user.date_naissance.getFullYear())
                }
                readOnly={!editMode}
              />
            </td>
          </tr>
          <tr>
            <td className="font-semibold p-4" colSpan={2}>
              <label htmlFor="email">Email:</label>
            </td>
            <td colSpan={2}>
              <input
                id="email"
                defaultValue={user.adresse_email}
                readOnly={!editMode}
              />
            </td>
          </tr>
          <tr>
            <td className="font-semibold p-4" colSpan={2}>
              <label htmlFor="telephone">Téléphone:</label>
            </td>
            <td>
              <input
                id="telephone"
                defaultValue={
                  user.telephone.substring(0, 3) +
                  "-" +
                  user.telephone.substring(3, 6) +
                  "-" +
                  user.telephone.substring(6, 10)
                }
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
            onClick={closeEditMode}
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
          onDelete={function (): void {
            throw new Error("Function not implemented.");
          }}
        ></SuppressionCompte>
      </div>
    </div>
  );
}
