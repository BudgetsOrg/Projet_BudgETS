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

type GraphiqueObjectifProps = {
  id_objectif: number;
  date_limite?: number;
  refreshKey?: string | number;
};

function economiesParMois(economies: Economie[]) {
  const moisMap = new Map<string, number>();

  economies.forEach((economie) => {
    const [year, month] = economie.date.split("-");
    if (!year || !month) return;

    const monthKey = `${year}-${month}`; // YYYY-MM
    moisMap.set(monthKey, (moisMap.get(monthKey) || 0) + economie.montant);
  });

  const sortedByMonth = Array.from(moisMap.entries())
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const last12Months = sortedByMonth.slice(-12);
  return {
    labels: last12Months.map((m) => m.month),
    values: last12Months.map((m) => m.total),
  };
}

export function GraphiqueObjectif({
  id_objectif,
  date_limite,
  refreshKey,
}: GraphiqueObjectifProps) {
  const [economies, setEconomies] = useState<Economie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadEconomies = async () => {
      try {
        setLoading(true);
        setError(null);
        const latestEconomies = await getEconomie(id_objectif);
        if (!cancelled) setEconomies(latestEconomies);
      } catch (err) {
        console.error("Erreur de chargement des économies :", err);
        if (!cancelled) setError("Impossible de charger les économies");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadEconomies();
    return () => {
      cancelled = true;
    };
  }, [id_objectif, refreshKey]);

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
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Le but",
          data: labels.map(() => date_limite),
          borderColor: "rgb(21, 198, 98)",
          backgroundColor: "rgba(21, 198, 98, 0.5)",
        },
      ],
    }),
    [labels, values, date_limite],
  );

  if (loading) return <div>Chargement du graphique...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (labels.length === 0) return <div>Aucun graphique à afficher</div>;

  return <Line options={options} data={data} />;
}

export default GraphiqueObjectif;
