import useDepense from "../hooks/UseDepense";
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
  return (
    <Bar
      data={{
        labels: [depenses.map((depense) => depense.date)],
        datasets: [
          {
            label: "Dépenses",
            data: depenses.map((depense) => depense.prix),
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
            beginAtZero: true,
            min: 0,
            max: Math.max(...depenses.map((depense) => depense.prix)) + 10,
          },
        },
      }}
      height={400}
    />
  );
}

export default GraphiqueEnveloppe;
