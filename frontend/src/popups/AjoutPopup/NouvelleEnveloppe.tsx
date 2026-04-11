import React, { useState } from "react";
import type { Enveloppe } from "../../interfaces";
import { postEnveloppe } from "../../api/EnveloppeApi";
import { useCloudinaryImage } from "../../hooks/useCloudinaryImage";
import addPhotoIcon from "../../img/add_photo_alternate_outlined.svg";
export default function NouvelleEnveloppe({
  showPopup,
  closePopup,
  onSaved,
}: {
  showPopup: boolean;
  closePopup: () => void;
  onSaved?: () => void;
}) {
  const [titre, setTitre] = useState("");
  const [montant, setMontant] = useState<string>("");

  const { previewUrl, file, uploading, error, onFileChange, upload, reset } =
    useCloudinaryImage({ folder: "enveloppes" });

  const handleClose = () => {
    setTitre("");
    setMontant("");
    reset(null);
    closePopup();
  };

  const handleSubmit = async () => {
    if (!titre.trim() || !montant || Number(montant) <= 0) {
      alert("Veuillez remplir le titre et le montant");
      return;
    }

    const nouvelleEnveloppe: Enveloppe = {
      titre: titre.trim(),
      montant: Number(montant),
      image: undefined,
    };

    try {
      if (file) {
        const uploadedUrl = await upload();
        if (uploadedUrl) {
          nouvelleEnveloppe.image = uploadedUrl;
        }
      }

      const response = await postEnveloppe(nouvelleEnveloppe);
      console.log("API Response:", response);

      handleClose();
      onSaved?.();
      if ((window as any).refreshEnveloppes) {
        (window as any).refreshEnveloppes();
      }
    } catch (error) {
      console.log("Error creating enveloppe:", error);
      alert("Erreur lors de la création de l'enveloppe. Veuillez réessayer.");
    }
  };

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
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
        />

        <label htmlFor="montant">Montant de l'enveloppe</label>
        <input
          type="number"
          id="montant"
          name="montant"
          className="border border-gray-300 rounded-lg p-2 w-full"
          step="0.01"
          min="0"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
        />
        <label htmlFor="image">Image de l'enveloppe</label>
        <div className="flex flex-col gap-2 mt-2">
          <div
            className="w-32 h-20 rounded-lg bg-cover bg-center border border-dashed border-gray-400 cursor-pointer flex items-center justify-center bg-gray-50"
            style={
              previewUrl
                ? {
                    backgroundImage: `url(${previewUrl})`,
                    borderStyle: "solid",
                  }
                : undefined
            }
            onClick={() => {
              const input = document.getElementById(
                "nouvelle-enveloppe-image-input",
              ) as HTMLInputElement | null;
              input?.click();
            }}
          >
            {!previewUrl && (
              <img
                src={addPhotoIcon}
                alt="Ajouter une image"
                className="w-10 h-10 opacity-70"
              />
            )}
          </div>
          <input
            id="nouvelle-enveloppe-image-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>

        <div className="flex flex-row justify-between gap-2 items-center mt-6">
          <button
            className="delete-button py-2 px-4 rounded-lg"
            onClick={handleClose}
          >
            Annuler
          </button>
          <button
            className="confirm-button py-2 px-4 rounded-lg"
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? "Ajout..." : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
