import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import type { Economie } from "../../interfaces";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

function economiesParMois(economies: Economie[]) {
  // Regrouper par date (YYYY-MM-DD)
  const totauxParJour = new Map<string, number>();

  economies.forEach((economie) => {
    const [annee, mois, jour] = economie.date.split("-");
    if (!annee || !mois || !jour) return;

    const cleJour = `${annee}-${mois}-${jour}`;
    totauxParJour.set(
      cleJour,
      (totauxParJour.get(cleJour) ?? 0) + economie.montant,
    );
  });

  // Trier les jours chronologiquement
  const sortedByDay = Array.from(totauxParJour.entries())
    .map(([day, total]) => ({ day, total }))
    .sort((a, b) => a.day.localeCompare(b.day));

  // Faire la somme cumulative : chaque point inclut les jours précédents
  let totalCumulatif = 0;
  const additionParJour = sortedByDay.map(({ day, total }) => {
    totalCumulatif += total;
    return { day, total: totalCumulatif };
  });

  // Garder seulement les 12 dernières dates
  const last12Days = additionParJour.slice(-12);

  return {
    labels: last12Days.map((m) => m.day),
    values: last12Days.map((m) => m.total),
  };
}

export function GraphiqueObjectif({
  economies,
  date_limite,
}: {
  economies: Economie[];
  date_limite: number;
}) {
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
      scales: {
        x: {
          ticks: {
            autoSkip: true,
          },
        },
      },
    }),
    [],
  );

  // useMemo : garde en cache valeurs calculées àa moins qu'il y a eu un changement dans économies ou date_limite
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
          fill: true,
          label: "Vos économies",
          data: values,
          borderColor: "rgb(150, 193, 110)",
          backgroundColor: "rgba(150, 193, 110, 0.5)",
        },
        {
          label: "Le but",
          data: labels.map(() => date_limite),
          borderColor: "rgb(120, 237, 12)",
          backgroundColor: "rgba(120, 237, 12, 0.5)",
        },
      ],
    }),
    [labels, values, date_limite],
  );

  if (labels.length === 0) return <div>Aucun graphique à afficher</div>;

  return (
    <div className="w-full h-200">
      <Line options={options} data={data} />
    </div>
  );
}

export default GraphiqueObjectif;
