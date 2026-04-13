import { useEffect, useState } from "react";
import { getEnveloppe } from "../../../api/EnveloppeApi";
import { PieChart } from "react-minimal-pie-chart";
import type { Data } from "../../../interfaces";
import type { Enveloppe } from "../../../interfaces";

interface PieChartProps {
  refreshKey: number;
}
export function SummaryPieChart({ refreshKey }: PieChartProps) {
  const [enveloppes, setEnveloppes] = useState<Enveloppe[]>([]);
  const [loading, setLoading] = useState(true); // Handle loading locally

  useEffect(() => {
    loadEnveloppes();
  }, [refreshKey]);

  // the hook is not used.
  const loadEnveloppes = async () => {
    try {
      const latestEnveloppes = await getEnveloppe();
      setEnveloppes(latestEnveloppes);
    } catch (error) {
      console.error("Erreur de chargement des enveloppes :", error);
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
    return <div>Aucun graphique</div>;
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
