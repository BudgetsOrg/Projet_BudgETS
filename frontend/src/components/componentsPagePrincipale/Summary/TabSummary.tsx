import { useState } from "react";
import { useBudgets } from "../../../hooks/UseBudgets";
import useEnveloppes from "../../../hooks/UseEnveloppes";
import type { Budget } from "../../../interfaces";
import NouvelleEnveloppe from "../../../popups/AjoutPopup/NouvelleEnveloppe";
import edit from "../../../../public/img/edit-icon.svg";
import SoldeBudgetPrinc from "../../../popups/SoldeBudgetPrinc";
export function TabSummary() {
  const [showNouveauPopup, setShowNouveauPopup] = useState(false);
  const [showSoldePopup, setShowSoldePopup] = useState(false);
  const {
    enveloppes,
    loading: loadingEnveloppe,
    error: errorEnveloppe,
  } = useEnveloppes();
  const { budgets, loading: loadingBudget, error: errorBudget } = useBudgets();

  //TODO : Pourrait être plus cute
  if (loadingEnveloppe || loadingBudget) return <div>Chargement...</div>;

  if (errorEnveloppe || errorBudget)
    return <div>Erreur: {errorEnveloppe || errorBudget}</div>;
  return (
    <div>
      <div className="flex flex-row gap-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Solde pour le mois: {budgets[0]?.soldeDuMois ?? 0} $
        </h3>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-1 rounded-lg"
          onClick={() => setShowSoldePopup(true)}
        >
          <img className="w-5 h-5" src={edit} alt="Edit" />
        </button>
      </div>
      <div className="">
        <SoldeBudgetPrinc
          showPopup={showSoldePopup}
          closePopup={() => setShowSoldePopup(false)}
        ></SoldeBudgetPrinc>
      </div>
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

/*
function findBudget(budgets: Budget[]) {
  // Implementation for finding a specific budget
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11
  const currentYear = today.getFullYear();

  return budgets.find((budget) => {
    const date =
      budget.date_creation instanceof Date
        ? budget.date_creation
        : new Date(budget.date_creation);

    if (Number.isNaN(date.getTime())) return false;
    return (
      date.getMonth() + 1 === currentMonth &&
      date.getFullYear() === currentYear
    );
  });
}*/
