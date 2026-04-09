import React from "react";
import type { Budget } from "../interfaces";
import { getLastBudget, updateBudget } from "../api/BudgetApi";
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
  const monBudget = await getLastBudget();
  const id_budget = monBudget.id_budget;
  try {
    await updateBudget(nouveauSolde, id_budget);
    closePopup();
    onSaved();
  } catch (error) {
    console.log("Error updating budget:", error);
  }
}
