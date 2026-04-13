import React, { useState } from "react";
import CheckBox from "../../components/componentsProfile/CheckBox";

export default function SuppressionCompte({
  showPopup,
  closePopup,
  onDelete,
}: {
  showPopup: boolean;
  closePopup: () => void;
  onDelete: () => void;
}) {
  // the boolean of the checkbox state is associated to isConfirmed, and if there is a change, must call "setter" setIsConfirmed to update the state of isConfirmed
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!showPopup) return null;

  const handleDelete = () => {
    if (isConfirmed) {
      onDelete();
      closePopup();
    }
  };

  return (
    <div className="fixed inset-40 bg-white bg-opacity-2 flex-col items-center justify-center rounded-lg p-6 shadow-lg">
      <h4 className="font-bold p-4 text-align-center">
        Veuillez confirmer l'action suivante{" "}
      </h4>
      <p className="text-sm text-align-center p-4">
        Est-ce que vous voulez procéder à la suppression de votre compte?{" "}
        <br></br>
        Une fois supprimé, votre compte ne pourra pas être rétabli.
      </p>

      <CheckBox checked={isConfirmed} onChange={setIsConfirmed} />
      <div className="flex flex-col gap-2 items-center">
        <button
          className="delete-button py-2 px-4 rounded-lg"
          onClick={closePopup}
        >
          Annuler
        </button>

        <button
          className="py-2 px-4 rounded-lg bg-red-500 text-white disabled:opacity-50"
          // now if clicked and isConfirmed is true, it will call backend with onDelete, and delete the account
          onClick={handleDelete}
          // button is disabled when checkbox is not checked
          disabled={!isConfirmed}
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
}
