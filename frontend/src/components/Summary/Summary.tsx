import { SummaryPieChart } from "./PieChart";
import { TabSummary } from "./TabSummary";

export function Summary() {
  return (
    <div className="relative flex flex-col w-full h-full text-black bg-white shadow-md rounded-lg bg-clip-border">
      <div className="summary-container flex flex-row">
        <TabSummary />
        <SummaryPieChart />
      </div>
    </div>
  );
}
