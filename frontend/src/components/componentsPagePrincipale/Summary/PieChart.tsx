import { PieChart } from "react-minimal-pie-chart";
import useEnveloppes from "../../../hooks/UseEnveloppes";
import type { Data } from "../../../interfaces";

export function SummaryPieChart() {
  const { enveloppes, loading, error } = useEnveloppes();

  //Could be changed to a spinner or a cuter message
  if (loading) return <div>Chargement...</div>;

  if (error) return <div>Erreur: {error}</div>;
  enveloppes.sort((a, b) => b.montant - a.montant);
  const dataTab: Data[] = enveloppes.map((env, index) => ({
    title: env.titre,
    value: env.montant,
    color: seedColors(env.id_enveloppe, index),
  }));

  if (dataTab.length === 0) {
    return <div>No data to display</div>;
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
