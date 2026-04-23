import { useEffect, useMemo, useState } from "react";
import { getBudgetById, getLastBudget } from "../../../api/BudgetApi";
import type { Budget, Enveloppe } from "../../../interfaces";
import NouvelleEnveloppe from "../../../popups/AjoutPopup/NouvelleEnveloppe";
import edit from "../../../img/edit-icon.svg";
import SoldeBudgetPrinc from "../../../popups/SoldeBudgetPrinc";
import {
  getSelectedBudgetId,
  setSelectedBudgetId,
} from "../../../utils/budgetSelection";

interface TabSummaryProps {
  refreshKey: number;
  onEnveloppesChanged: () => void;
  readOnly?: boolean;
}

export function TabSummary({
  refreshKey,
  onEnveloppesChanged,
  readOnly,
}: TabSummaryProps) {
  const [showNouveauPopup, setShowNouveauPopup] = useState(false);
  const [showSoldePopup, setShowSoldePopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [enveloppes, setEnveloppes] = useState<Enveloppe[]>([]);

  const sortedEnveloppes = useMemo(
    () => [...enveloppes].sort((a, b) => b.montant - a.montant),
    [enveloppes],
  );

  const normalizeBudget = (data: any): Budget | null => {
    if (!data) return null;
    if (Array.isArray(data)) {
      if (data.length === 0) return null;
      const sorted = [...data].sort((a: any, b: any) => {
        const da = new Date(a?.date_creation ?? 0).getTime();
        const db = new Date(b?.date_creation ?? 0).getTime();
        return db - da;
      });
      // prendre plus récent de la liste
      return sorted[0] as Budget;
    }
    // si c'est pas un array, on suppose que c'est déjà un budget
    return data as Budget;
  };

  // on load les deux !
  const loadSelectedBudgetAndEnveloppes = async () => {
    setError(null);
    setLoading(true);
    try {
      const selectedId = getSelectedBudgetId();
      let selectedBudget: Budget | null = null;

      if (selectedId) {
        selectedBudget = normalizeBudget(await getBudgetById(selectedId));
      }

      if (!selectedBudget) {
        selectedBudget = normalizeBudget(await getLastBudget());
        setSelectedBudgetId(selectedBudget?.id_budget);
      }

      setBudget(selectedBudget);
      // prendre les enveloppes du budget sélectionné, ou un array vide si pas de budget ou pas d'enveloppes
      setEnveloppes(selectedBudget?.enveloppes ?? []);
    } catch (err: any) {
      setError(err?.message ?? "Erreur de chargement");
      setBudget(null);
      setEnveloppes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSelectedBudgetAndEnveloppes();
  }, [refreshKey]);

  // Pour refresh budget et enveloppes quand on fait des changements dans les popups, on expose une fonction globale que les popups peuvent appeler
  useEffect(() => {
    (window as any).refreshTabSummary = async () => {
      await loadSelectedBudgetAndEnveloppes();
    };
  }, []);

  if (loading) return <div>Chargement...</div>;

  if (error) return <div>Erreur: {error}</div>;
  return (
    <div>
      <div className="flex flex-row gap-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Solde pour le mois: {budget?.soldeDuMois ?? 0} $
        </h3>
        <button
          className={`bg-gray-300 text-gray-800 font-bold py-1 px-1 rounded-lg ${
            readOnly ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"
          }`}
          onClick={() => {
            // peut pas cliquer si readOnly, sinon show le popup
            if (readOnly) return;
            setShowSoldePopup(true);
          }}
          disabled={!!readOnly}
        >
          <img className="w-5 h-5" src={edit} alt="Edit" />
        </button>
      </div>
      <div className="">
        <SoldeBudgetPrinc
          showPopup={showSoldePopup}
          closePopup={() => setShowSoldePopup(false)}
          onSaved={loadSelectedBudgetAndEnveloppes}
        ></SoldeBudgetPrinc>
      </div>
      <table className="w-full text-left table-auto min-w-max text-slate-800">
        <tbody>
          <tr>
            <th>
              <span className="px-3 py-1 text-xs rounded-full bg-[var(--color-primary)] text-white">
                Mes différentes enveloppes budgétaires
              </span>
            </th>
          </tr>
          {sortedEnveloppes.map((env) => (
            <tr key={env.id_enveloppe}>
              <td className="p-4">{env.titre}</td>
              <td className="p-4">{env.montant} $</td>
            </tr>
          ))}
          <tr>
            <td className="p-4 " colSpan={2}>
              {!readOnly && (
                <button
                  className="cursor-pointer bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg"
                  onClick={() => setShowNouveauPopup(true)}
                >
                  Creer une enveloppe
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="">
        {!readOnly && (
          <NouvelleEnveloppe
            showPopup={showNouveauPopup}
            closePopup={() => setShowNouveauPopup(false)}
            // tell everyone about changes
            onSaved={async () => {
              await loadSelectedBudgetAndEnveloppes(); // Update local table
              onEnveloppesChanged(); // Tell PagePrincipale to refresh everything else
            }}
          ></NouvelleEnveloppe>
        )}
      </div>
    </div>
  );
}
