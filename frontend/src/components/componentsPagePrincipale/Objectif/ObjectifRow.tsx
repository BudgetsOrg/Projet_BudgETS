import type { Objectif } from "../../../interfaces";
import { useNavigate } from "react-router-dom";
import { deleteObjectif } from "../../../api/ObjectifApi";

interface ObjectifRowProps {
  objectif: Objectif;
  onRefresh: () => void;
}
export function ObjectifRow({ onRefresh, objectif }: ObjectifRowProps) {
  const navigate = useNavigate();

  const nbUtilisateurs = objectif.users
    ? objectif.users.length
    : 0;
  console.log("ObjectifRow rendered with objectif:", objectif);
  console.log("Objectif has utilisateurs:", objectif.Utilisateurs);
  console.log("Number of users sharing this objectif:", nbUtilisateurs);
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

  const handleDelete = async () => {
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
      <img
        className="w-full h-full object-cover rounded-xl"
        src={objectif.image}
        alt={objectif.titre}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-transparent"></div>
      <h3 className="absolute top-3 left-4 text-white text-lg font-bold">
        {objectif.titre}
      </h3>
      <button
        className="absolute delete-button bottom-2 rounded-lg right-2 hover:bg-red-600 width-20 h-8"
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
