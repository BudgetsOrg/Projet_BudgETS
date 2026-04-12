import { useState } from "react";
import addPhotoIcon from "../../img/add_photo_alternate_outlined.svg";
import { useCloudinaryImage } from "../../hooks/useCloudinaryImage";
import { updateUtilisateurImage } from "../../api/UtilisateurApi";

type EditProfilePictureProps = {
  profilePicture: string;
  onImageUpdated?: () => void;
};

export function EditProfilePicture({
  profilePicture,
  onImageUpdated,
}: EditProfilePictureProps) {
  const [showPopup, setShowPopup] = useState(false);

  const { previewUrl, file, uploading, error, onFileChange, upload, reset } =
    useCloudinaryImage({ initialUrl: profilePicture, folder: "profiles" });

  const openPopup = () => {
    reset(profilePicture);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSave = async () => {
    try {
      let imageUrl = profilePicture;

      if (file) {
        const uploadedUrl = await upload();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      if (imageUrl !== profilePicture) {
        await updateUtilisateurImage(imageUrl);
        onImageUpdated?.();
      }

      setShowPopup(false);
    } catch (e) {
      console.error("Erreur lors de la mise à jour de l'image de profil", e);
      alert(
        "Une erreur est survenue lors du téléchargement de l'image. Veuillez réessayer.",
      );
    }
  };

  return (
    <div className="relative items-center space-y-4">
      <div
        className="w-32 h-32 rounded-full bg-cover bg-center"
        style={{ backgroundImage: `url(${profilePicture})` }}
      ></div>
      <button
        onClick={openPopup}
        className="absolute top-25 left-25 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        <img
          src={addPhotoIcon}
          alt="Changer la photo de profil"
          className="w-5 h-5"
        />
      </button>

      {showPopup && (
        <div className="fixed inset-40 bg-white bg-opacity-2 flex flex-col items-center justify-center rounded-lg p-6 shadow-lg z-50">
          <h4 className="font-bold p-4 text-center">
            Modifier la photo de profil
          </h4>
          <div
            className="w-32 h-32 rounded-full bg-cover bg-center mb-4"
            style={{ backgroundImage: `url(${previewUrl || profilePicture})` }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="mb-4"
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <div className="flex flex-row gap-4 items-center mt-2">
            <button
              className="delete-button py-2 px-4 rounded-lg"
              onClick={closePopup}
              disabled={uploading}
            >
              Annuler
            </button>
            <button
              className="confirm-button py-2 px-4 rounded-lg disabled:opacity-50"
              onClick={handleSave}
              disabled={uploading || !file}
            >
              {uploading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
