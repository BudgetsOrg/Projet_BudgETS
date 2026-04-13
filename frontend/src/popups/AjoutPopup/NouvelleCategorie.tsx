import React, { useState } from "react";
import type { Categorie } from "../../interfaces";
import { postCategorie } from "../../api/CategorieApi";
export default function NouvelleCategorie({
  showPopup,
  closePopup,
  onSaved,
}: {
  showPopup: boolean;
  closePopup: () => void;
  onSaved?: () => void;
}) {
  const [nom, setNom] = useState("");
  const handleClose = () => {
    setNom("");
    closePopup();
  };

  const handleSubmit = async () => {
    if (!nom.trim()) {
      alert("Veuillez remplir le nom de la catégorie");
      return;
    }

    const nouvelleCategorie: Categorie = {
      nom_categorie: nom.trim(),
    };

    try {
      const response = await postCategorie(nouvelleCategorie);
      console.log("API Response:", response);
      handleClose();
      onSaved?.();
      if ((window as any).refreshCategories) {
        (window as any).refreshCategories();
      }
    } catch (error) {
      console.log("Error creating catégorie:", error);
      alert("Erreur lors de la création de la catégorie. Veuillez réessayer.");
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed top-40 h-70 w-100 left-20 bg-white bg-opacity-2 flex-col items-center justify-center rounded-lg shadow-lg">
      <div className="w-full bg-[var(--color-primary)] px-6 py-4 rounded-lg text-center">
        <h4 className="font-bold text-lg p-4 text-align-center text-white">
          Créer une nouvelle catégorie
        </h4>
      </div>
      <div className="p-6">
        <label htmlFor="nom">Nom de la catégorie</label>
        <input
          type="text"
          id="nom"
          name="nom"
          className="border border-gray-300 rounded-lg w-full"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />

        <div className="flex flex-row justify-between gap-2 items-center mt-6">
          <button
            className="confirm-button py-2 px-4 rounded-lg"
            onClick={handleSubmit}
          >
            Ajouter
          </button>
          <button
            className="delete-button py-2 px-4 rounded-lg"
            onClick={handleClose}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
