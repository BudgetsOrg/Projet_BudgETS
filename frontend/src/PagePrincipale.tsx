import { PieChart } from "react-minimal-pie-chart";

type PagePrincipaleProps = {
  // it is not a string will have to be changed
  utilisateurCourant: string;
};

type ProfilProps = {
  utilisateurCourant: string;
};

//prend en paramètre les budgets et calculer les proportions en pourcentage
function GraphCirculaire() {
  <PieChart
    data={[
      { title: "One", value: 10, color: "#E38627" },
      { title: "Two", value: 15, color: "#C13C37" },
      { title: "Three", value: 20, color: "#6A2135" },
    ]}
  />;
}

function MesEnveloppesBudgetaires() {
  return <div>Mes enveloppes</div>;
}

function MesBudgets() {
  return <div>Mes budgets</div>;
}

function BudgetsContainer() {
  return;
  <div>Budgets</div>;
}

function ObjectifsContainer() {
  return <div>Objectifs</div>;
}

export function PagePrincipale({ utilisateurCourant }: PagePrincipaleProps) {
  return (
    <div>
      <Profil utilisateurCourant={utilisateurCourant} />
      <BudgetsContainer />
      <ObjectifsContainer />
    </div>
  );
}

export default function App() {
  return <PagePrincipale utilisateurCourant="yes" />;
}
