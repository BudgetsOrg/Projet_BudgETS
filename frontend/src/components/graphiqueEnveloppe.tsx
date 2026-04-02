import useDepense from "../hooks/UseDepense";
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

export function GraphiqueEnveloppe() {
  const { depenses, loading, error } = useDepense();

  //Could be changed to a spinner or a cuter message
  if (loading) return <div>Chargement...</div>;

  if (error) return <div>Erreur: {error}</div>;

  if (depenses.length === 0)
    return <div>Vous n'avez présentement aucune dépense. </div>;
  else {
    // un map initial clé-valeur pour les données de dépenses
    const firstMap = new Map<string, number>();

    // parcourir les dépenses et remplir le map avec la date et le prix total de la journée
    depenses.forEach((depense) => {
      // la date est en string au départ, convertir celle-ci en objet Date pour pouvoir la formater ensuite
      const [year, month, day] = depense.date.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);
      const date = dateObj.toLocaleDateString("fr-CA"); // Format: YYYY-MM-DD
      const daySpending = firstMap.get(date) || 0;
      firstMap.set(date, daySpending + depense.prix);
    });

    // un map trié par la date, clé= date et valeur = prix total de la journée
    const sortedDepenses = Array.from(firstMap.entries())
      .map(([date, prix]) => ({ date, prix }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const last7DaysDepenses = sortedDepenses.slice(-7);
    return (
      <Bar
        data={{
          labels: last7DaysDepenses.map((depense) => depense.date),
          datasets: [
            {
              label: "Dépenses ($) ",

              data: last7DaysDepenses.map((depense) => depense.prix),
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
              max:
                Math.max(...sortedDepenses.map((depense) => depense.prix)) + 10,
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
