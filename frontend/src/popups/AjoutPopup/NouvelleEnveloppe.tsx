import React, { useState } from "react";
import type { Enveloppe } from "../../interfaces";
import {
  getEnveloppe,
  postEnveloppe,
  updateEnveloppe,
} from "../../api/EnveloppeApi";
export default function NouvelleEnveloppe({
  showPopup,
  closePopup,
  onSaved,
}: {
  showPopup: boolean;
  closePopup: () => void;
  onSaved?: () => void;
}) {
  if (!showPopup) return null;

  return (
    <div className="fixed top-15 h-100 w-100 left-40 bg-white bg-opacity-2 flex-col items-center justify-center rounded-lg shadow-lg">
      <div className="w-full bg-[var(--color-primary)] px-6 py-4 rounded-lg text-center">
        <h4 className="font-bold text-lg p-4 text-align-center text-white">
          Créer une nouvelle enveloppe
        </h4>
      </div>
      <div className="p-6">
        <label htmlFor="titre">Titre de l'enveloppe</label>
        <input
          type="text"
          id="titre"
          name="titre"
          className="border border-gray-300 rounded-lg w-full"
        />

        <label htmlFor="montant">Montant de l'enveloppe</label>
        <input
          type="number"
          id="montant"
          name="montant"
          className="border border-gray-300 rounded-lg p-2 w-full"
          step="0.01"
          min="0"
        />
        <label htmlFor="image">Image de l'enveloppe</label>
        <input
          type="text"
          id="image"
          name="image"
          className="border border-gray-300 rounded-lg p-2 w-full"
        />

        <div className="flex flex-row justify-between gap-2 items-center mt-6">
          <button
            className="delete-button py-2 px-4 rounded-lg"
            onClick={closePopup}
          >
            Annuler
          </button>
          <button
            className="confirm-button py-2 px-4 rounded-lg"
            onClick={() => handleSubmit(closePopup, onSaved)}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

async function handleSubmit(closePopup: () => void, onSaved?: () => void) {
  // function to handle the form submission and create the new envelope
  const nouvelleEnveloppe: Enveloppe = {
    titre: (document.getElementById("titre") as HTMLInputElement).value,
    montant: (document.getElementById("montant") as HTMLInputElement)
      .valueAsNumber,
    image: (document.getElementById("image") as HTMLInputElement).value,
  };
  if (nouvelleEnveloppe.titre.length != 0 && nouvelleEnveloppe.montant != 0) {
    try {
      const response = await postEnveloppe(nouvelleEnveloppe);
      console.log("API Response:", response);

      closePopup();
      onSaved?.();
      // Also refresh any global envelope displays
      if ((window as any).refreshEnveloppes) {
        (window as any).refreshEnveloppes();
      }
    } catch (error) {
      console.log("Error creating enveloppe:", error);
    }
  } else {
    alert("Veuillez remplir le titre et le montant");
  }
}
