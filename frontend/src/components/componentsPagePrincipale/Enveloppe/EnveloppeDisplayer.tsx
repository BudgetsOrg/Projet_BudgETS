import { useEffect } from "react";
import { useState } from "react";
import useEnveloppes from "../../../hooks/UseEnveloppes";
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

  // when called, fetches enveloppes and sets them
  const loadEnveloppes = async () => {
    try {
      setLoading(true);
      const latestEnveloppes = await getEnveloppe();
      setEnveloppes(latestEnveloppes);
    } catch (error) {
      console.error("Erreur de chargement:", error);
      setEnveloppes([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadEnveloppes();
  }, [refreshKey]);
  //Could be changed to a spinner or a cuter message
  if (loading) return <div>Chargement...</div>;

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
