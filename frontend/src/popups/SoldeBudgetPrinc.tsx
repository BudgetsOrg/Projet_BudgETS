import { getLastBudget, updateBudget } from "../api/BudgetApi";
import {
  getSelectedBudgetId,
  setSelectedBudgetId,
} from "../utils/budgetSelection";
export default function SoldeBudget({
  showPopup,
  closePopup,
  onSaved,
}: {
  showPopup: boolean;
  closePopup: () => void;
  onSaved: () => void;
}) {
  if (!showPopup) return null;

  return (
    <div className="fixed top-40 h-50 w-100 left-20 bg-white bg-opacity-2 flex-col items-center justify-center rounded-lg shadow-lg">
      <div className="w-full bg-[var(--color-primary)] px-2 py-2 rounded-lg text-center">
        <h4 className="font-bold text-lg p-2 text-align-center text-white">
          Définir le solde du budget
        </h4>
      </div>
      <div className="p-4">
        <label htmlFor="montant"></label>
        <input
          type="number"
          id="montant"
          name="montant"
          className="border border-gray-300 rounded-lg p-2 w-full"
        />

        <div className="flex flex-row justify-between gap-2 items-center mt-4">
          <button
            className="delete-button py-2 px-4 rounded-lg"
            onClick={closePopup}
          >
            Annuler
          </button>
          <button
            className="confirm-button py-2 px-4 rounded-lg"
            onClick={() => handleEdit(closePopup, onSaved)}
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}

async function handleEdit(closePopup: () => void, onSaved: () => void) {
  const nouveauSolde = (document.getElementById("montant") as HTMLInputElement)
    .valueAsNumber;

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

  let id_budget = getSelectedBudgetId();
  if (!id_budget) {
    const lastBudget: any = await getLastBudget();
    const normalized = normalizeBudget(lastBudget);
    id_budget = normalized?.id_budget;
    setSelectedBudgetId(id_budget);
  }

  if (!id_budget) {
    console.log("Impossible de déterminer le budget à modifier");
    return;
  }

  try {
    const newBudget = await updateBudget(nouveauSolde, id_budget);
    console.log("Budget mis à jour :", newBudget);
    // Re-store in case backend returns a different id or selection changed
    setSelectedBudgetId(newBudget?.id_budget ?? id_budget);
    closePopup();
    onSaved();
  } catch (error) {
    console.log("Error updating budget:", error);
  }
}
