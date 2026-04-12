import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { Economie } from "../../interfaces";
import { useEffect, useMemo, useState } from "react";
import { getEconomie } from "../../api/EconomieApi";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function economiesParMois(economies: Economie[]) {
  const moisMap = new Map<string, number>();

  economies.forEach((economie) => {
    const [year, month] = economie.date.split("-");
    if (!year || !month) return;

    // On utilise "YYYY-MM" comme clé pour regrouper par mois
    const monthKey = `${year}-${month}`; // YYYY-MM
    // si même clé par mois, on additionne les montants
    // le map est monthkey: montant total pour ce mois
    moisMap.set(monthKey, (moisMap.get(monthKey) || 0) + economie.montant);
  });

  // on ne prend pas le map d'avant direct,
  // on doit le trier par mois et prendre les 12 derniers mois
  const sortedByMonth = Array.from(moisMap.entries())
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const last12Months = sortedByMonth.slice(-12);
  // labels=mois du map, values=montant total pour ce mois
  return {
    labels: last12Months.map((m) => m.month),
    values: last12Months.map((m) => m.total),
  };
}

export function GraphiqueObjectif(

  { economies,date_limite }: { economies: Economie[],date_limite: number },
) {
  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: "Vos économies par rapport à l'atteinte de votre objectif",
        },
      },
    }),
    [],
  );

  // on set les labels et les valeurs en appelant la fonction avec les économies en paramètre qui créé un map parfait
  const { labels, values } = useMemo(
    () => economiesParMois(economies),
    [economies],
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Vos économies",
          data: values,
          borderColor: "var(--color-primary)",
          backgroundColor: "var(--color-secondary)",
        },
        {
          label: "Le but",
          data: labels.map(() => date_limite),
          borderColor: "var(--color-secondary)",
          backgroundColor: "rgba(11, 16, 13, 0.5)",
        },
      ],
    }),
    [labels, values, date_limite],
  );

  if (labels.length === 0) return <div>Aucun graphique à afficher</div>;

  return <Line options={options} data={data} />;
}

export default GraphiqueObjectif;
