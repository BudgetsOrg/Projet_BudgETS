import type { Objectif } from "../../../interfaces";
import { useNavigate } from "react-router-dom";
export function ObjectifRow(objectif: Objectif) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/PageObjectif/${objectif.id_objectif}`, { state: { id_objectif: objectif.id_objectif, titre: objectif.titre } });
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
      <button className="absolute delete-button bottom-2 rounded-lg right-2 hover:bg-red-600 width-20 h-8">
        Quitter
      </button>
      <p className="absolute right-2 top-2">Partagé avec 3 personnes</p>
    </div>
  );
}
