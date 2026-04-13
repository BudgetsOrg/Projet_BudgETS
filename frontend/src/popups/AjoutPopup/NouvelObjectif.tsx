import { useState } from "react";
import { useCloudinaryImage } from "../../hooks/useCloudinaryImage";
import type { Objectif } from "../../interfaces";
import { postObjectif } from "../../api/ObjectifApi";
import addPhotoIcon from "../../img/add_photo_alternate_outlined.svg";
export default function NouvelObjectif({
  showPopup,
  closePopup,
  onSaved,
}: {
  showPopup: boolean;
  closePopup: () => void;
  onSaved?: () => void;
}) {
  const [titre, setTitre] = useState("");
  const [dateLimite, setDateLimite] = useState<string>("");
  const [montant, setMontant] = useState<string>("");

  const { previewUrl, file, uploading, error, onFileChange, upload, reset } =
    useCloudinaryImage({ folder: "objectifs" });

  const handleClose = () => {
    setTitre("");
    setDateLimite("");
    setMontant("");
    reset(null);
    closePopup();
  };

  const handleSubmit = async () => {
    if (!titre.trim() || !dateLimite || !montant || Number(montant) <= 0) {
      alert("Veuillez remplir le titre, le montant et la date limite");
      return;
    }

    const nouvelObjectif: Objectif = {
      date_limite: dateLimite,
      titre: titre.trim(),
      montant: Number(montant),
      image: "",
    };

    try {
      if (file) {
        const uploadedUrl = await upload();
        if (uploadedUrl) {
          nouvelObjectif.image = uploadedUrl;
        }
      }

      const response = await postObjectif(nouvelObjectif);
      console.log("API Response:", response);

      handleClose();
      onSaved?.();
      if ((window as any).refreshObjectifs) {
        (window as any).refreshObjectifs();
      }
    } catch (error) {
      console.log("Error creating objectif:", error);
      alert("Erreur lors de la création de l'objectif. Veuillez réessayer.");
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed top-40 h-120 w-100 left-20 bg-white bg-opacity-2 flex-col items-center justify-center rounded-lg shadow-lg">
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
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
        />

        <label htmlFor="montant">Montant de l'objectif</label>
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

        <label htmlFor="date_limite">Date limite</label>
        <input
          type="date"
          id="date_limite"
          name="date_limite"
          className="border border-gray-300 rounded-lg p-2 w-full"
          value={dateLimite}
          onChange={(e) => setDateLimite(e.target.value)}
        />
        <label htmlFor="image">Image de l'objectif</label>
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
                "nouvel-objectif-image-input",
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
            id="nouvel-objectif-image-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>

        <div className="flex flex-row justify-between gap-2 items-center mt-6">
          <button
            className="confirm-button py-2 px-4 rounded-lg"
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? "Ajout..." : "Ajouter"}
          </button>{" "}
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
