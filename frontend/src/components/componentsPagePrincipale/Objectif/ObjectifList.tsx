import { useState } from "react";
import { useObjectif } from "../../../hooks/useObjectifs";
import { ObjectifRow } from "./ObjectifRow";
import NouvelObjectif from "../../../popups/AjoutPopup/NouvelObjectif";

export default function ObjectifList() {
  // state pour montrer le popup d'un nouvelObjectif
  const [showNouveauObjectifPopup, setShowNouveauObjectifPopup] =
    useState(false);
  // state pour refresh les objectifs s'il y a changement
  const [objectifRefresh, setObjectifRefresh] = useState(0);
  // Le hook est changé pour utiliser le refreshKey, soit utiliser le hook quand il y a un changement
  const { objectifs, loading, error } = useObjectif(objectifRefresh);

  // quand cette fonction est appelé, donc un objectif change, changer le state pour marquer ce changement
  const handleObjectifChange = () => {
    setObjectifRefresh((prev) => prev + 1);
  };

  if (loading) return <div>Chargement...</div>;

  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <div className="flex flex-row gap-4">
        <h1 className="text-4xl font-bold p-4">Mes objectifs</h1>
        <button
          className="cursor-pointer bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg h-10 self-center"
          onClick={() => setShowNouveauObjectifPopup(true)}
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
              {/*Passer au composant: quand refresh, donner setter du state du displayer d'objectifs et donner l'objectif */}
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
          // showPopup est associé au bool du state showNouveauObjectif
          showPopup={showNouveauObjectifPopup}
          // close quand on set à false
          closePopup={() => setShowNouveauObjectifPopup(false)}
          // une fois que le nouvel objectif est ajouté, on refresh la liste pour que le nouvel objectif s'affiche
          onSaved={handleObjectifChange}
        ></NouvelObjectif>
      </div>
    </div>
  );
}
