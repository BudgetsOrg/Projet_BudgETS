import { useEffect, useState } from "react";
import { getBudget } from "../api/api";
import type { Budget } from "../interfaces/interfaces";

// Utilise la fonction getBudget pour récupérer les budgets de l'utilisateur et gère les états de chargement et d'erreur
export default function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBudget();
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
