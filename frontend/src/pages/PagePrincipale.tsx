//Justine
import { PieChart } from "react-minimal-pie-chart";
import type { Obj } from "../interfaces/interfaces.ts";
import type { Enveloppe } from "../interfaces/interfaces.ts";
import { EnveloppesBudgetaires } from "../components/Enveloppe/EnveloppeDisplayer.tsx";
import { Summary } from "../components/Summary/Summary.tsx";
import { TabSummary } from "../components/Summary/TabSummary.tsx";
import { ObjectifList } from "../components/Objectif/ObjectifList.tsx";

export function PagePrincipale() {
  return (
    <div className="space-y-8 px-4">
      <h2 className="mb-4 text-4xl font-bold tracking-tight text-heading md:text-5xl lg:text-6xl">
        BudgETS
      </h2>
      <Summary />
      <EnveloppesBudgetaires />
      <ObjectifList />
    </div>
  );
}

export default PagePrincipale;
