import { useState } from "react";
import { useObjectif } from "../../../hooks/useObjectifs";
import { ObjectifRow } from "./ObjectifRow";
import NouvelObjectif from "../../../popups/AjoutPopup/NouvelObjectif";

export default function ObjectifList() {
  const [showPopup, setShowPopup] = useState(false);
  const [objectifRefresh, setObjectifRefresh] = useState(0);
  // le hook est changé pour utiliser le refreshKey, soit utiliser le hook quand il y a un changement
  const { objectifs, loading, error } = useObjectif(objectifRefresh);

  const handleObjectifChange = () => {
    setObjectifRefresh((prev) => prev + 1);
  };

  //Could be changed to a spinner or a cuter message
  if (loading) return <div>Chargement...</div>;

  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <div className="flex flex-row gap-4">
        <h1 className="text-4xl font-bold p-4">Mes objectifs</h1>
        <button
          className="cursor-pointer bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg h-10 self-center"
          onClick={() => setShowPopup(true)}
        >
          Ajouter un objectif
        </button>
      </div>
      <div className="space-y-4">
        {objectifs.length === 0 ? (
          <p className="text-gray-500 text-center">
            Aucun objectif trouvé. Ajoutez-en un !
          </p>
        ) : (
          objectifs.map((objectif) => (
            <div key={objectif.id_objectif} className="objectifs">
              {/*Passer au composant le setter du state pour si qqun quitter l'objectif le visuel est up-to-date */}
              <ObjectifRow
                onRefresh={handleObjectifChange}
                objectif={objectif}
              />
            </div>
          ))
        )}
      </div>
      <div className="absolute ">
        <NouvelObjectif
          showPopup={showPopup}
          closePopup={() => setShowPopup(false)}
          // une fois que le nouvel objectif est ajouté, on refresh la liste pour que le nouvel objectif s'affiche
          onSaved={handleObjectifChange}
        ></NouvelObjectif>
      </div>
    </div>
  );
}
