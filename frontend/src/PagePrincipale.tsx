//Justine
import { PieChart } from "react-minimal-pie-chart";
import type { Obj } from "./interfaces/interfaces.ts";
import type { Enveloppe } from "./interfaces/interfaces.ts";
import { EnveloppesBudgetaires } from "./components/Enveloppe/EnveloppeDisplayer.tsx";
import { Summary } from "./components/Summary/Summary.tsx";
import { TabSummary } from "./components/Summary/TabSummary.tsx";

const tab_objectifs: Enveloppe[] = [];

function fetchObjectifs() {}

//prend en paramètre les budgets et calculer les proportions en pourcentage
// function GraphCirculaire() {
//   return (
//     <div>
//       <PieChart
//         data={[
//           { title: "One", value: 10, color: "" },
//           { title: "Two", value: 15, color: "#C13C37" },
//           { title: "Three", value: 20, color: "#6A2135" },
//         ]}
//         radius={30}
//       />
//     </div>
//   );
// }

// function MesBudgets() {
//   return (
//     <div>
//       <h1>Mes BudgETS</h1>
//       <table>
//         <tr>
//           <th>Solde pour le mois: 500$</th>
//         </tr>
//         <tr>
//           <td>Nourriture</td>
//           <td>50$</td>
//         </tr>
//         <tr>
//           <button>Creer une enveloppe</button>
//         </tr>
//       </table>
//       <h3>Mes différentes enveloppes</h3>
//     </div>
//   );
// }

function BudgetsContainer() {
  return (
    <div className="container-budgets">
      {/* <MesBudgets />
      <GraphCirculaire /> */}
      <EnveloppesBudgetaires />
    </div>
  );
}

function ObjectifsContainer() {
  if (tab_objectifs.length === 0)
    return <div>Vous n'avez présentement aucun objectif. </div>;
  // return (
  //   // <div>
  //   //   {tab_enveloppes.map((env) => (
  //   //     <div key={obj.id} className="objectifs">
  //   //       <Objectif id={env.id} name={env.name} image={env.content} />
  //   //     </div>
  //   //   ))}
  //   // </div>
  // );
}

function Objectif({ id, name, image }: Obj) {
  return (
    <div className="objectif" id={String(id)}>
      <img src={image} alt="{id}"></img>
      <h3 className="title-objectif">{name}</h3>
    </div>
  );
}

export function PagePrincipale() {
  return (
    <div className="mainPage">
      <h2 className="text-4xl font-bold">BudgETS</h2>
      <Summary />
      <BudgetsContainer />
      <ObjectifsContainer />
    </div>
  );
}

export default PagePrincipale;
