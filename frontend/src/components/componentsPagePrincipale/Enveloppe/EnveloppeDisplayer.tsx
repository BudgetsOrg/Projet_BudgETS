import { useEffect, useRef, useState } from "react";
import { EnveloppeCard } from "./EnveloppeCard";
import { getEnveloppe } from "../../../api/EnveloppeApi";
import type { Enveloppe } from "../../../interfaces";

interface displayerProps {
  onEnveloppesChanged: () => void;
  refreshKey: number;
}

export function EnveloppesBudgetaires({
  onEnveloppesChanged,
  refreshKey,
}: displayerProps) {
  const [enveloppes, setEnveloppes] = useState<Enveloppe[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedOnceRef = useRef(false);

  // when called, fetches enveloppes and sets them
  const loadEnveloppes = async () => {
    try {
      // Avoid "blink" on refresh (e.g., after delete): keep current list visible.
      if (!hasLoadedOnceRef.current) setLoading(true);
      const latestEnveloppes = await getEnveloppe();
      setEnveloppes(latestEnveloppes);
    } catch (error) {
      console.error("Erreur de chargement:", error);
      // If this is a refresh, keep the previous data instead of clearing the UI.
      if (!hasLoadedOnceRef.current) setEnveloppes([]);
    } finally {
      setLoading(false);
      hasLoadedOnceRef.current = true;
    }
  };
  useEffect(() => {
    loadEnveloppes();
  }, [refreshKey]);
  //Could be changed to a spinner or a cuter message
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
