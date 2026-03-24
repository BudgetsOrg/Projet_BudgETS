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
    <div className="fixed top-40 h-100 w-100 left-20 bg-white bg-opacity-2 flex-col items-center justify-center rounded-lg p-6 shadow-lg">
      <h4 className="font-bold bg-var(--color-primary) p-4 text-align-center text-white">
        Créer une nouvelle enveloppe
      </h4>
      <label htmlFor="titre">Titre de l'enveloppe</label>
      <input
        type="text"
        id="titre"
        name="titre"
        className="border border-gray-300 rounded-lg p-2 w-full"
      />

      <label htmlFor="montant">Montant de l'enveloppe</label>
      <input
        type="text"
        id="montant"
        name="montant"
        className="border border-gray-300 rounded-lg p-2 w-full"
      />

      <div className="flex flex-col gap-2 items-center">
        <button
          className="delete-button py-2 px-4 rounded-lg"
          onClick={closePopup}
        >
          Annuler
        </button>

        <button className="py-2 px-4 rounded-lg bg-var(--color-secondary) text-white hover:bg-white hover:text-var(--color-secondary) border-2">
          Ajouter
        </button>
      </div>
    </div>
  );
}
