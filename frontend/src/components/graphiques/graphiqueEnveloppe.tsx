import type { Depense } from "../../interfaces";
// must install following librairy for chart
// source is this library
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function GraphiqueEnveloppe({ depenses }: { depenses: Depense[] }) {
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) {
      return null;
    }

    const safeDateString = dateString.split("T")[0].trim();

    let day: number;
    let month: number;
    let year: number;

    if (safeDateString.includes("/")) {
      [day, month, year] = safeDateString.split("/").map(Number);
    } else if (safeDateString.includes("-")) {
      [year, month, day] = safeDateString.split("-").map(Number);
    } else {
      return null;
    }

    if (!day || !month || !year) {
      return null;
    }

    const parsedDate = new Date(year, month - 1, day);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  if (!depenses || depenses.length === 0)
    return <div>Aucun graphique à afficher</div>;
  else {
    // un map initial clé-valeur pour les données de dépenses
    const firstMap = new Map<string, number>();

    // parcourir les dépenses et remplir le map avec la date et le prix total de la journée
    depenses.forEach((depense) => {
      // la date est au format JJ/MM/AAAA, convertir celle-ci en objet Date pour pouvoir la formater ensuite
      const dateObj = parseDate(depense.date);

      if (!dateObj) {
        return;
      }

      const date = dateObj.toLocaleDateString("fr-CA"); // Format: YYYY-MM-DD
      const depensesParJour = firstMap.get(date) || 0;
      firstMap.set(date, depensesParJour + depense.montant);
    });

    // un map trié par la date, clé= date et valeur = prix total de la journée
    const sortedDepenses = Array.from(firstMap.entries())
      .map(([date, prix]) => ({ date, prix }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const derniers7Jours = sortedDepenses.slice(-7);
    if (derniers7Jours.length === 0) {
      return <div>Aucun graphique à afficher</div>;
    }

    const maxPrix = Math.max(...derniers7Jours.map((depense) => depense.prix));

    return (
      <Bar
        data={{
          labels: derniers7Jours.map((depense) => depense.date),
          datasets: [
            {
              label: "Dépenses ($) ",

              data: derniers7Jours.map((depense) => depense.prix),
              backgroundColor: "#96c16e",
              borderColor: "#888",
              borderWidth: 0.5,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              title: {
                display: true,
                text: "Prix (en $)",
                color: "#333",
                font: {
                  size: 16,
                  weight: "bold",
                },
              },
              beginAtZero: true,
              min: 0,
              max: maxPrix + 10,
            },
            x: {
              title: {
                display: true,
                text: "7 derniers jours de dépenses",
                color: "#333",
                font: {
                  size: 16,
                  weight: "bold",
                },
              },
            },
          },
        }}
        height={400}
      />
    );
  }
}

export default GraphiqueEnveloppe;
