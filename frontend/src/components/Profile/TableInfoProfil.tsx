import type { User } from "../../interfaces/interfaces";
import SuppressionCompte from "../../popups/SuppressionPopup/SuppressionCompte";
import React, { useState } from "react";

export function TableInfoProfil(user: User) {
  const [showSuppressionPopup, setShowSuppressionPopup] = useState(false);

  return (
    <div className="w-full p-4 bg-white shadow-md rounded-lg">
      <table className="w-full table-fixed break-words">
        <tbody>
          <tr>
            <td className="font-semibold p-4">Nom:</td>
            <td>{user.nom}</td>
            <td className="font-semibold p-4">Prenom:</td>
            <td>{user.prenom}</td>
          </tr>
          <tr>
            <td className="font-semibold p-4" colSpan={2}>
              Date de naissance:
            </td>
            <td>
              {String(user.date_naissance.getDate())}/
              {String(user.date_naissance.getMonth() + 1)}/
              {String(user.date_naissance.getFullYear())}
            </td>
          </tr>
          <tr>
            <td className="font-semibold p-4" colSpan={2}>
              Email:
            </td>
            <td>{user.adresse_email}</td>
          </tr>
          <tr>
            <td className="font-semibold p-4" colSpan={2}>
              Téléphone:
            </td>
            <td>
              {user.telephone.substring(0, 3)}-{user.telephone.substring(3, 6)}-
              {user.telephone.substring(6, 10)}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex items-center justify-center p-4">
        <button className="confirm-button py-2 px-4 rounded-lg">
          Modifier information
        </button>
      </div>
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
