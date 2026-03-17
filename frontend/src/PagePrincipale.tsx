//Justine
import { PieChart } from "react-minimal-pie-chart";
// import react

//prend en paramètre les budgets et calculer les proportions en pourcentage
function GraphCirculaire() {
  return (
    <div>
      <PieChart
        data={[
          { title: "One", value: 10, color: "#E38627" },
          { title: "Two", value: 15, color: "#C13C37" },
          { title: "Three", value: 20, color: "#6A2135" },
        ]}
        radius={10}
      />
    </div>
  );
}

function MesEnveloppesBudgetaires() {
  return <div>Vous n'avez présentement aucune enveloppe budgétaires. </div>;
}

function MesBudgets() {
  return (
    <div>
      <h1>Mes BudgETS</h1>
      <table>
        <tr>
          <th>Solde pour le mois: 500$</th>
        </tr>
        <tr>
          <td>Nourriture</td>
          <td>50$</td>
        </tr>
        <tr>
          <button>Creer une enveloppe</button>
        </tr>
      </table>
      <h3>Mes différentes enveloppes</h3>
    </div>
  );
}

function BudgetsContainer() {
  return (
    <div className="container-budgets">
      <MesBudgets />
      <GraphCirculaire />
      <MesEnveloppesBudgetaires />
    </div>
  );
}

function ObjectifsContainer() {
  return <div>Vous n'avez présentement aucun objectif.</div>;
}

export function PagePrincipale() {
  return (
    <div className="mainPage">
      <BudgetsContainer />
      <ObjectifsContainer />
    </div>
  );
}

export default PagePrincipale;
