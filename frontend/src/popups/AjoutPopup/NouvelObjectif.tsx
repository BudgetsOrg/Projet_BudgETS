import React, { useState } from "react";

export default function NouvelleEnveloppe({
  showPopup,
  closePopup,
}: {
  showPopup: boolean;
  closePopup: () => void;
}) {
  if (!showPopup) return null;

  return (
    <div className="fixed top-40 h-90 w-100 left-20 bg-white bg-opacity-2 flex-col items-center justify-center rounded-lg shadow-lg">
      <div className="w-full bg-[var(--color-primary)] px-6 py-4 rounded-lg text-center">
        <h4 className="font-bold text-lg p-4 text-align-center text-white">
          Créer un nouvel objectif
        </h4>
      </div>
      <div className="p-6">
        <label htmlFor="titre">Titre de l'objectif</label>
        <input
          type="text"
          id="titre"
          name="titre"
          className="border border-gray-300 rounded-lg w-full"
        />

        <label htmlFor="montant">Montant de l'objectif</label>
        <input
          type="text"
          id="montant"
          name="montant"
          className="border border-gray-300 rounded-lg p-2 w-full"
        />

        <div className="flex flex-col gap-2 items-center mt-6">
          <button
            className="confirm-button py-2 px-4 rounded-lg"
            onClick={closePopup}
            // also add the function to actually create the envelope
          >
            Ajouter
          </button>{" "}
          <button
            className="delete-button py-2 px-4 rounded-lg"
            onClick={closePopup}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
