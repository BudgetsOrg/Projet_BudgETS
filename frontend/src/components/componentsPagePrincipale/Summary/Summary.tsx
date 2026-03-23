import { SummaryPieChart } from "./PieChart";
import { TabSummary } from "./TabSummary";

export function Summary() {
  return (
    <div className="px-4 relative flex flex-col w-full h-auto text-black bg-white shadow-md rounded-lg bg-clip-border">
      <div className="summary-container grid grid-cols-2 gap-4 p-4">
        <TabSummary />
        <SummaryPieChart />
      </div>
    </div>
  );
}
