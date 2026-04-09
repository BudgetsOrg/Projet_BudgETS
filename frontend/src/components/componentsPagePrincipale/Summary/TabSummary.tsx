import { useEffect, useState } from "react";
import { getLastBudget } from "../../../api/BudgetApi";
import { getEnveloppe } from "../../../api/EnveloppeApi";
import { useBudgets } from "../../../hooks/UseBudgets";
import useEnveloppes from "../../../hooks/UseEnveloppes";
import type { Budget, Enveloppe } from "../../../interfaces";
import NouvelleEnveloppe from "../../../popups/AjoutPopup/NouvelleEnveloppe";
import edit from "../../../img/edit-icon.svg";
import SoldeBudgetPrinc from "../../../popups/SoldeBudgetPrinc";

interface TabSummaryProps {
  refreshKey: number;
  onEnveloppesChanged: () => void;
}

export function TabSummary({
  refreshKey,
  onEnveloppesChanged,
}: TabSummaryProps) {
  const [showNouveauPopup, setShowNouveauPopup] = useState(false);
  const [showSoldePopup, setShowSoldePopup] = useState(false);
  const {
    enveloppes: enveloppesFromHook,
    loading: loadingEnveloppe,
    error: errorEnveloppe,
  } = useEnveloppes();

  useEffect(() => {
    loadEnveloppes();
    loadBudget();
  }, [refreshKey]);
  const {
    budget: budgetFromHook,
    loading: loadingBudget,
    error: errorBudget,
  } = useBudgets();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [enveloppes, setEnveloppes] = useState<Enveloppe[]>([]);

  useEffect(() => {
    if (budgetFromHook) {
      setBudget(budgetFromHook);
    }
  }, [budgetFromHook]);

  useEffect(() => {
    if (enveloppesFromHook) {
      setEnveloppes(enveloppesFromHook);
    }
  }, [enveloppesFromHook]);

  const loadBudget = async () => {
    try {
      const latestBudget = await getLastBudget();
      setBudget(latestBudget);
    } catch (error) {
      console.error("Erreur de chargement du budget :", error);
    }
  };

  const loadEnveloppes = async () => {
    try {
      const latestEnveloppes = await getEnveloppe();
      setEnveloppes(latestEnveloppes);
    } catch (error) {
      console.error("Erreur de chargement des enveloppes :", error);
    }
  };

  // Expose both refresh functions globally
  useEffect(() => {
    (window as any).refreshTabSummary = async () => {
      await loadBudget();
      await loadEnveloppes();
    };
  }, []);

  //TODO : Pourrait être plus cute
  if (loadingEnveloppe || loadingBudget) return <div>Chargement...</div>;

  if (errorEnveloppe || errorBudget)
    return <div>Erreur: {errorEnveloppe || errorBudget}</div>;
  return (
    <div>
      <div className="flex flex-row gap-4">
        <h3 className="text-xl font-semibold text-gray-800">
          Solde pour le mois: {budget?.soldeDuMois ?? 0} $
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
          onSaved={loadBudget}
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
        </tbody>
      </table>
      <div className="">
        <NouvelleEnveloppe
          showPopup={showNouveauPopup}
          closePopup={() => setShowNouveauPopup(false)}
          // tell everyone about changes
          onSaved={async () => {
            await loadEnveloppes(); // Update local table
            onEnveloppesChanged(); // Tell PagePrincipale to refresh everything else
          }}
        ></NouvelleEnveloppe>
      </div>
    </div>
  );
}
