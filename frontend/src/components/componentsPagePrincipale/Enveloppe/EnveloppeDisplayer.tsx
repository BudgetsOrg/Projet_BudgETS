import { useEffect, useRef, useState } from "react";
import { EnveloppeCard } from "./EnveloppeCard";
import { getEnveloppe } from "../../../api/EnveloppeApi";
import type { Enveloppe } from "../../../interfaces";

// on reçoit de PagePrincipale : refreshKey ->le state(0), onEnveloppesChanged, fait changer l'état
interface displayerProps {
  onEnveloppesChanged: () => void;
  refreshKey: number;
}

export function EnveloppesBudgetaires({
  onEnveloppesChanged,
  refreshKey,
}: displayerProps) {
  // getterSetter Enveloppes, même choses pour loading
  const [enveloppes, setEnveloppes] = useState<Enveloppe[]>([]);
  const [loading, setLoading] = useState(true);

  // useRef() ne prévoque pas de refresh, utilisé pour le premier chargement
  const hasLoadedOnceRef = useRef(false);

  // quand appelé, get les enveloppes de l'api et les set
  const loadEnveloppes = async () => {
    try {
      // si premier load, on set le refresh
      if (!hasLoadedOnceRef.current) setLoading(true);
      // on va chercher les enveloppes et set les enveloppes qu'on a
      const latestEnveloppes = await getEnveloppe();
      setEnveloppes(latestEnveloppes);
    } catch (error) {
      console.error("Erreur de chargement:", error);
      // Si c'est un refresh, on ne reload pas l'infos on prends les enveloppes telles quelles
      if (!hasLoadedOnceRef.current) setEnveloppes([]);
    } finally {
      setLoading(false);
      // ensuite, on n'utilisera pas
      hasLoadedOnceRef.current = true;
    }
  };

  // quand la valeur de la clé change, il faut appeler loadEnveloppes().
  useEffect(() => {
    loadEnveloppes();
  }, [refreshKey]);

  // if loading == true voici de quoi à l'air le chargement
  if (loading && enveloppes.length === 0) return <div>Chargement...</div>;

  if (enveloppes.length === 0)
    return <div>Vous n'avez présentement aucune enveloppe budgétaires. </div>;
  return (
    <div className="custom-scrollbar overflow-x-scroll">
      <h6 className=" text-md p-4 text-align-center text-black">
        {enveloppes.length} enveloppes
      </h6>
      <div className="flex gap-4 pb-4">
        {enveloppes.map((env) => (
          <div key={env.id_enveloppe} className="flex-shrink-0 w-64">
            <EnveloppeCard {...env} onSaved={onEnveloppesChanged} />
          </div>
        ))}
      </div>
    </div>
  );
}
