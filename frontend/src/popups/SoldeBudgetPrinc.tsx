import React, { useState } from "react";

export default function SoldeBudget({
  showPopup,
  closePopup,
}: {
  showPopup: boolean;
  closePopup: () => void;
}) {
  if (!showPopup) return null;

  return (
    <div className="fixed top-40 h-50 w-100 left-20 bg-white bg-opacity-2 flex-col items-center justify-center rounded-lg shadow-lg">
      <div className="w-full bg-[var(--color-primary)] px-2 py-2 rounded-lg text-center">
        <h4 className="font-bold text-lg p-2 text-align-center text-white">
          Définir le solde du budget
        </h4>
      </div>
      <div className="p-4">
        <label htmlFor="montant"></label>
        <input
          type="text"
          id="montant"
          name="montant"
          className="border border-gray-300 rounded-lg p-2 w-full"
        />

        <div className="flex flex-row justify-between gap-2 items-center mt-4">
          <button
            className="delete-button py-2 px-4 rounded-lg"
            onClick={closePopup}
          >
            Annuler
          </button>
          <button
            className="confirm-button py-2 px-4 rounded-lg"
            onClick={closePopup}
            // on click call post function of budget
            // also add the function to change the solde
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
