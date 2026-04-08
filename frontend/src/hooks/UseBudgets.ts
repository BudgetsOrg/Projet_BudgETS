import { useEffect, useState } from "react";
import { getLastBudget, postBudget, updateBudget } from "../api/BudgetApi";
import type { Budget } from "../interfaces";

// Utilise la fonction getBudget pour récupérer les budgets de l'utilisateur et gère les états de chargement et d'erreur
export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getLastBudget();
        setBudgets(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { budgets, loading, error };
}

export async function postBudgets(budget: Budget) {
  try {
    const createdBudget = await postBudget(budget);
    return createdBudget as Budget;
  } catch (err: any) {
    throw new Error(err?.message ?? "Erreur lors de l'envoi du budget");
  }
}
/*
export async function updateBudget(budget: Budget) {
  try {
    const updatedBudget = await updateBudget(budget);
    return updatedBudget as Budget;
  } catch (err: any) {
    throw new Error(err?.message ?? "Erreur lors de la mise à jour du budget");
  }
}

*/
