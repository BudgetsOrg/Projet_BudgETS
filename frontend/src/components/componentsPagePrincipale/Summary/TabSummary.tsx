import { useState } from "react";
import useBudgets from "../../../hooks/UseBudgets";
import useEnveloppes from "../../../hooks/UseEnveloppes";
import type { Budget } from "../../../interfaces/interfaces";
import NouvelleEnveloppe from "../../../popups/AjoutPopup/NouvelleEnveloppe";

export function TabSummary() {
  const [showNouveauPopup, setShowNouveauPopup] = useState(false);
  const {
    enveloppes,
    loading: loadingEnveloppe,
    error: errorEnveloppe,
  } = useEnveloppes();
  const { budgets, loading: loadingBudget, error: errorBudget } = useBudgets();
  console.log(budgets);
  //TODO : Pourrait être plus cute
  if (loadingEnveloppe || loadingBudget) return <div>Chargement...</div>;

  if (errorEnveloppe || errorBudget)
    return <div>Erreur: {errorEnveloppe || errorBudget}</div>;
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 my-4">
        Solde pour le mois: {budgets[0]?.solde || 0} $
      </h3>
      <table className="w-full text-left table-auto min-w-max text-slate-800">
        <tr>
          <th>
            <span className="px-3 py-1 text-xs rounded-full bg-[var(--color-primary)] text-white">
              Mes différentes enveloppes budgétaires
            </span>
          </th>
        </tr>
        {enveloppes.map((env) => (
          <tr key={env.id_enveloppe}>
            <td className="p-4">{env.titre}</td>
            <td className="p-4">{env.montant} $</td>
          </tr>
        ))}
        <tr>
          <td className="p-4 " colSpan={2}>
            <button
              className="cursor-pointer bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg"
              onClick={() => setShowNouveauPopup(true)}
            >
              Creer une enveloppe
            </button>
          </td>
        </tr>
      </table>
      <div className="">
        <NouvelleEnveloppe
          showPopup={showNouveauPopup}
          closePopup={() => setShowNouveauPopup(false)}
        ></NouvelleEnveloppe>
      </div>
    </div>
  );
}

//TODO : Ideally the backend should provide an endpoint to get the current budget
// For now, we can implement a function to find the current budget based on the date
function findBudget(budgets: Budget[]) {
  // Implementation for finding a specific budget
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11
  const currentYear = today.getFullYear();
  console.log(budgets);
  return budgets.find(
    (budget) =>
      budget.date_creation.getMonth() + 1 === currentMonth &&
      budget.date_creation.getFullYear() === currentYear,
  );
}
