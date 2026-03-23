import { useObjectif } from "../../../hooks/useObjectifs";
import { ObjectifRow } from "./ObjectifRow";

export function ObjectifList() {
  const { objectifs, loading, error } = useObjectif();

  //Could be changed to a spinner or a cuter message
  if (loading) return <div>Chargement...</div>;

  if (error) return <div>Erreur: {error}</div>;

  if (objectifs.length === 0)
    return <div>Vous n'avez présentement aucun objectif. </div>;
  return (
    <div>
      <h1 className="text-4xl font-bold p-4">Mes objectifs</h1>
      <div className="space-y-4">
        {objectifs.map((objectif) => (
          <div key={objectif.id_objectif} className="objectifs">
            <ObjectifRow {...objectif} />
          </div>
        ))}
      </div>
    </div>
  );
}
