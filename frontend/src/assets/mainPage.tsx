type PagePrincipaleProps = {
  // it is not a string will have to be changed
  utilisateurCourant: string;
};

type ProfilProps = {
  utilisateurCourant: string;
};

function Profil({ utilisateurCourant }: ProfilProps) {
  return;
  <div>
    utilisateurCourant.nom + utilisateurCourant.prenom + \br +
    utilisateurCourant
  </div>;
}

function BudgetsContainer() {
  return;
  <div>Budgets</div>;
}

function ObjectifsContainer() {
  return <div>Objectifs</div>;
}

function GraphCirculaire() {
  return <div>Graph circulaire</div>;
}

function MesEnveloppesBudgetaires() {
  return <div>Mes enveloppes</div>;
}

function MesBudgets() {
  return <div>Mes budgets</div>;
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
  return <PagePrincipale />;
}
