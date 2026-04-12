import PopUpHistoriqueBudget from "../../popups/PopUpHistoriqueBudget.tsx";
import { useState } from "react";

export default function HistoriqueBudget() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <div>
        <button
          onClick={() => setShowPopup(true)}
          className="confirm-button bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-white font-bold py-2 px-4 rounded-lg"
        >
          Consultez l'historique de vos budgets
        </button>
      </div>
      <PopUpHistoriqueBudget
        showPopup={showPopup}
        closePopup={() => setShowPopup(false)}
      />
    </div>
  );
}
