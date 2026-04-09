import { useState } from "react";
import { EnveloppesBudgetaires } from "../components/componentsPagePrincipale/Enveloppe/EnveloppeDisplayer.tsx";
import { Summary } from "../components/componentsPagePrincipale/Summary/Summary.tsx";
import { ObjectifList } from "../components/componentsPagePrincipale/Objectif/ObjectifList.tsx";

export function PagePrincipale() {
  const [enveloppesRefresh, setEnveloppesRefresh] = useState(0);

  const handleEnveloppesChanged = () => {
    setEnveloppesRefresh((prev) => prev + 1);
  };
  return (
    <div className="space-y-8 px-4 bg-white">
      <h2 className="mb-4 text-4xl font-bold tracking-tight text-heading md:text-5xl lg:text-6xl">
        BudgETS
      </h2>
      <Summary
        refreshKey={enveloppesRefresh}
        onEnveloppesChanged={handleEnveloppesChanged}
      />
      <EnveloppesBudgetaires
        refreshKey={enveloppesRefresh}
        onEnveloppesChanged={handleEnveloppesChanged}
      />
      <ObjectifList />
    </div>
  );
}

export default PagePrincipale;
