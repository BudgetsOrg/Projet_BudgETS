import type { Objectif } from "../../interfaces/interfaces";
export function ObjectifRow(objectif: Objectif) {
  return (
    <div
      className="relative w-full h-32 rounded-xl overflow-hidden shadow-lg hover:opacity-90 cursor-pointer"
      id={String(objectif.id_objectif)}
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
    </div>
  );
}
