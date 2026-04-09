import { useEffect, useState } from "react";
import { getEnveloppe } from "../../../api/EnveloppeApi";
import useEnveloppes from "../../../hooks/UseEnveloppes";
import type { Enveloppe } from "../../../interfaces";
import { EnveloppeCard } from "./EnveloppeCard";

export function EnveloppesBudgetaires() {
  const {
    enveloppes: enveloppesFromHook,
    loading,
    error,
  } = useEnveloppes();
  const [enveloppes, setEnveloppes] = useState<Enveloppe[]>([]);

  useEffect(() => {
    if (enveloppesFromHook) {
      setEnveloppes(enveloppesFromHook);
    }
  }, [enveloppesFromHook]);

  const loadEnveloppes = async () => {
    try {
      const latestEnveloppes = await getEnveloppe();
      setEnveloppes(latestEnveloppes);
    } catch (error) {
      console.error("Erreur de chargement des enveloppes :", error);
    }
  };

  // Expose loadEnveloppes globally for other components to call
  useEffect(() => {
    (window as any).refreshEnveloppeDisplayer = loadEnveloppes;
  }, []);

  //Could be changed to a spinner or a cuter message
  if (loading) return <div>Chargement...</div>;

  if (error) return <div>Erreur: {error}</div>;

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
            <EnveloppeCard {...env} onSaved={loadEnveloppes} />
          </div>
        ))}
      </div>
    </div>
  );
}
