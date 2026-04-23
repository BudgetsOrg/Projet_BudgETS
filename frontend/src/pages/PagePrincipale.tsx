import { useCallback, useEffect, useMemo, useState } from "react";
import { EnveloppesBudgetaires } from "../components/componentsPagePrincipale/Enveloppe/EnveloppeDisplayer.tsx";
import { Summary } from "../components/componentsPagePrincipale/Summary/Summary.tsx";
import ObjectifList from "../components/componentsPagePrincipale/Objectif/ObjectifList.tsx";
import HistoriqueBudget from "../components/componentsPagePrincipale/HistoriqueBudget.tsx";
import type { Budget } from "../interfaces";
import { getBudgetById, getLastBudget } from "../api/BudgetApi";
import {
  getSelectedBudgetId,
  setSelectedBudgetId,
} from "../utils/budgetSelection";

export function PagePrincipale() {
  // state pour changement des enveloppes et pour le budget sélectionné
  const [enveloppesRefresh, setEnveloppesRefresh] = useState(0);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true); // Handle loading locally

  // UseMemo : It only re-computes the memorized value when one of its dependencies changes. google AI overview
  const isReadOnly = useMemo(() => {
    if (!selectedBudget?.date_creation) return false;
    const budgetDate = new Date(selectedBudget.date_creation);
    if (Number.isNaN(budgetDate.getTime())) return false;
    const now = new Date();
    return (
      budgetDate.getUTCFullYear() < now.getUTCFullYear() ||
      (budgetDate.getUTCFullYear() === now.getUTCFullYear() &&
        budgetDate.getUTCMonth() < now.getUTCMonth())
    );
  }, [selectedBudget?.date_creation]);

  // loadSelectedBudget : get le budget sélectionné dans le localStorage, si pas de sélection, get le dernier budget créé, et le set comme sélectionné
  // UseCallback : même chose quwwe useMemo mais pour les fonctions
  const loadSelectedBudget = useCallback(async () => {
    const normalizeBudget = (data: any): Budget | null => {
      if (!data) return null;
      if (Array.isArray(data)) {
        if (data.length === 0) return null;
        const sorted = [...data].sort((a: any, b: any) => {
          const da = new Date(a?.date_creation ?? 0).getTime();
          const db = new Date(b?.date_creation ?? 0).getTime();
          return db - da;
        });
        // prendre le plus récent
        return sorted[0] as Budget;
      }
      return data as Budget;
    };

    try {
      // vient du storage
      const selectedId = getSelectedBudgetId();
      let budget: Budget | null = null;

      if (selectedId) {
        // si il existe déjà un budget dans le localStorage, on le get
        budget = normalizeBudget(await getBudgetById(selectedId));
      }

      // sinon prendre le dernier budget et le set comme sélectionné dans le localStorage
      // a lieu lors du premier chargement de la page
      if (!budget) {
        budget = normalizeBudget(await getLastBudget());
        setSelectedBudgetId(budget?.id_budget);
      }

      // mettre dans le state
      setSelectedBudget(budget);
    } catch (e) {
      console.log("Erreur de chargement du budget sélectionné:", e);
      setSelectedBudget(null);
    }
    setLoading(false);
  }, []);
  const handleEnveloppesChanged = () => {
    setEnveloppesRefresh((prev) => prev + 1);
  };

  useEffect(() => {
    loadSelectedBudget();
  }, [loadSelectedBudget]);

  useEffect(() => {
    const handler = () => {
      loadSelectedBudget();
      setEnveloppesRefresh((prev) => prev + 1);
    };

    window.addEventListener("selectedBudgetChanged", handler as EventListener);
    return () =>
      window.removeEventListener(
        "selectedBudgetChanged",
        handler as EventListener,
      );
  }, [loadSelectedBudget]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-8 px-4 bg-white">
      <div className="grid grid-cols-3 items-end gap-4">
        <h2 className="font-bold tracking-tight text-heading lg:text-6xl">
          BudgETS
        </h2>
        <h2 className="font-bold tracking-tight text-heading lg:text-4xl">
          {selectedBudget?.date_creation
            ? `${new Intl.DateTimeFormat("fr-FR", {
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(selectedBudget.date_creation))}`
            : "Aucun budget sélectionné"}
        </h2>
        <HistoriqueBudget></HistoriqueBudget>
      </div>
      <Summary
        refreshKey={enveloppesRefresh}
        onEnveloppesChanged={handleEnveloppesChanged}
        readOnly={isReadOnly}
      />
      <EnveloppesBudgetaires
        refreshKey={enveloppesRefresh}
        onEnveloppesChanged={handleEnveloppesChanged}
        readOnly={isReadOnly}
      />
      <ObjectifList readOnly={isReadOnly} />
    </div>
  );
}

export default PagePrincipale;
