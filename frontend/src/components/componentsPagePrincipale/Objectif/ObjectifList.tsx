import { useState } from "react";
import { useObjectif } from "../../../hooks/useObjectifs";
import { ObjectifRow } from "./ObjectifRow";
import NouvelObjectif from "../../../popups/AjoutPopup/NouvelObjectif";

export default function ObjectifList() {
  const [showPopup, setShowPopup] = useState(false);
  const { objectifs, loading, error } = useObjectif();

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
              <ObjectifRow {...objectif} />
            </div>
          ))
        )}
      </div>
      <div className="absolute ">
        <NouvelObjectif
          showPopup={showPopup}
          closePopup={() => setShowPopup(false)}
        ></NouvelObjectif>
      </div>
    </div>
  );
}
