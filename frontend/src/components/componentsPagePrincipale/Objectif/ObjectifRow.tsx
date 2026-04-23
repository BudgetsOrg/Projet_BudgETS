import type { Objectif } from "../../../interfaces";
import { useNavigate } from "react-router-dom";
import { deleteObjectif } from "../../../api/ObjectifApi";

interface ObjectifRowProps {
  objectif: Objectif;
  onRefresh: () => void;
  readOnly?: boolean;
}
export function ObjectifRow({
  onRefresh,
  objectif,
  readOnly,
}: ObjectifRowProps) {
  const navigate = useNavigate();

  const hasImage = Boolean(objectif.image?.trim());

  const nbUtilisateurs = objectif.users ? objectif.users.length - 1 : 0;

  const handleClick = () => {
    navigate(`/PageObjectifs/${objectif.id_objectif}`, {
      state: {
        id_objectif: objectif.id_objectif,
        titre: objectif.titre,
        montantAccumule: objectif.montant,
        imageUrl: objectif.image,
      },
    });
  };

  // gérer la suppression
  const handleDelete = async () => {
    // si il n'y a pas de id,
    if (!objectif.id_objectif) return;
    try {
      // change le state au du parent
      console.log("Deleting objectif with id:", objectif.id_objectif);
      await deleteObjectif(objectif.id_objectif);
      onRefresh();
    } catch (error) {
      console.log("Error deleting objectif:", error);
    }
  };

  return (
    <div
      className="relative w-full h-32 rounded-xl overflow-hidden shadow-lg hover:opacity-90 cursor-pointer"
      id={String(objectif.id_objectif)}
      onClick={handleClick}
    >
      {hasImage ? (
        <>
          <img
            className="w-full h-full object-cover rounded-xl"
            src={objectif.image}
            alt={objectif.titre}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-transparent" />
          <h3 className="absolute top-3 left-4 text-white text-lg font-bold">
            {objectif.titre}
          </h3>
        </>
      ) : (
        <>
          <div className="w-full h-full bg-[#ECEABE]" />
          <h3 className="absolute top-3 left-4 text-black text-lg font-bold">
            {objectif.titre}
          </h3>
        </>
      )}
      <button
        className={`absolute delete-button bottom-2 rounded-lg right-2 width-20 h-8 ${
          readOnly ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
        }`}
        disabled={!!readOnly}
        onClick={(e) => {
          e.stopPropagation(); // pour pas cliquer sur objectif quand clique sur quitter
          handleDelete();
        }}
      >
        Quitter
      </button>
      <p className="absolute right-2 top-2 bg-black/50 text-white px-2 py-1 rounded">
        Partagé avec {nbUtilisateurs} personnes
      </p>
    </div>
  );
}
