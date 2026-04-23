import { useEffect, useRef, useState } from "react";
import { EnveloppeCard } from "./EnveloppeCard";
import { getBudgetById, getLastBudget } from "../../../api/BudgetApi";
import type { Enveloppe } from "../../../interfaces";
import {
  getSelectedBudgetId,
  setSelectedBudgetId,
} from "../../../utils/budgetSelection";

// on reçoit de PagePrincipale : refreshKey ->le state(0), onEnveloppesChanged, fait changer l'état et readOnly
interface displayerProps {
  onEnveloppesChanged: () => void;
  refreshKey: number;
  readOnly?: boolean;
}

export function EnveloppesBudgetaires({
  onEnveloppesChanged,
  refreshKey,
  readOnly,
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

      const normalizeBudget = (data: any): any | null => {
        if (!data) return null;
        if (Array.isArray(data)) {
          if (data.length === 0) return null;
          const sorted = [...data].sort((a: any, b: any) => {
            const da = new Date(a?.date_creation ?? 0).getTime();
            const db = new Date(b?.date_creation ?? 0).getTime();
            return db - da;
          });
          return sorted[0];
        }
        return data;
      };

      const selectedId = getSelectedBudgetId();
      let budget: any | null = null;
      if (selectedId) budget = normalizeBudget(await getBudgetById(selectedId));
      if (!budget) {
        budget = normalizeBudget(await getLastBudget());
        setSelectedBudgetId(budget?.id_budget);
      }

      setEnveloppes((budget?.enveloppes ?? []) as Enveloppe[]);
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
    return (
      <div className="text-gray-500 text-start">
        Vous n'avez présentement aucune enveloppe budgétaires.{" "}
      </div>
    );
  return (
    <div className="custom-scrollbar overflow-x-scroll">
      <h6 className=" text-md p-4 text-align-center text-black">
        {enveloppes.length} enveloppes
      </h6>
      <div className="flex gap-4 pb-4">
        {enveloppes.map((env) => (
          <div key={env.id_enveloppe} className="flex-shrink-0 w-64">
            <EnveloppeCard
              {...env}
              onSaved={onEnveloppesChanged}
              readOnly={readOnly}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
