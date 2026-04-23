import { useEffect, useState } from "react";
import { getBudgetById, getLastBudget } from "../../../api/BudgetApi";
import { PieChart } from "react-minimal-pie-chart";
import type { Data } from "../../../interfaces";
import type { Enveloppe } from "../../../interfaces";
import {
  getSelectedBudgetId,
  setSelectedBudgetId,
} from "../../../utils/budgetSelection";

interface PieChartProps {
  refreshKey: number;
}
export function SummaryPieChart({ refreshKey }: PieChartProps) {
  const [enveloppes, setEnveloppes] = useState<Enveloppe[]>([]);
  const [loading, setLoading] = useState(true); // Handle loading locally

  useEffect(() => {
    loadEnveloppes();
  }, [refreshKey]);

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

  const loadEnveloppes = async () => {
    try {
      const selectedId = getSelectedBudgetId();
      let budget: any | null = null;
      if (selectedId) budget = normalizeBudget(await getBudgetById(selectedId));
      if (!budget) {
        budget = normalizeBudget(await getLastBudget());
        setSelectedBudgetId(budget?.id_budget);
      }
      setEnveloppes(budget?.enveloppes ?? []);
    } catch (error) {
      console.error("Erreur de chargement des enveloppes :", error);
      setEnveloppes([]);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div>Chargement du graphique...</div>;
  const sortedEnveloppes = [...enveloppes].sort(
    (a, b) => b.montant - a.montant,
  );
  const dataTab: Data[] = sortedEnveloppes.map((env, index) => ({
    title: env.titre,
    value: Number(env.montant),
    color: seedColors(env.id_enveloppe, index),
  }));

  if (dataTab.length === 0) {
    return <div className="text-gray-500 text-center">Aucun graphique</div>;
  }

  return (
    <div className="h-64 w-full flex flex-col gap-2 items-center justify-center">
      <h2 className="font-bold"> Répartition des enveloppes </h2>
      <PieChart data={dataTab} radius={50} className="h-full w-full" />
    </div>
  );
}

function seedColors(id: number, position: number) {
  console.log(`id: ${id}, position: ${position}`);
  const colors = ["#125b48", "#96c16e", "#013528", "#6fb4a3", "#0fa17c"];
  if (position > colors.length) {
    return genColor(id);
  } else {
    return colors[position];
  }
}

// Source : https://stackoverflow.com/a/8134122
function genColor(seed: number) {
  let color = Math.floor(Math.abs(Math.sin(seed) * 16777215)).toString(16);
  // pad any colors shorter than 6 characters with leading 0s
  while (color.length < 6) {
    color = "0" + color;
  }

  return color;
}
