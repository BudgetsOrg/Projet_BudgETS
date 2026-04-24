import { getLastBudget, postBudget } from "../api/BudgetApi";
import { clearSelectedBudgetId } from "../utils/budgetSelection";
import type { Budget, EnveloppeCreate } from "../interfaces";
import { postEnveloppe } from "../api/EnveloppeApi";

export default function ChangerBudget({
  showPopup,
  closePopup,
}: {
  showPopup: boolean;
  closePopup: () => void;
}) {
  const handleNewBudget = async () => {
    try {
      console.log("Chercher un budget du mois précédent pour le copier...");
      const lastBudgetResponse = await getLastBudget();
      const lastBudget: Budget = await lastBudgetResponse;
      console.log("Budget du mois précédent trouvé:", lastBudget);
      const budget: Budget = {
        soldeDuMois: Number(lastBudget.soldeDuMois),
        date_creation: "2026-05-01",
      };
      console.log(budget);
      const response = await postBudget(budget);
      console.log("Nouveau budget créé:", response);
      const enveloppes: EnveloppeCreate[] =
        lastBudget.enveloppes?.map((enveloppe) => ({
          titre: enveloppe.titre,
          montant: Number(enveloppe.montant),
          image: enveloppe.image,
        })) ?? [];

      if (enveloppes.length > 0) {
        await Promise.all(
          enveloppes.map((enveloppe) => postEnveloppe(enveloppe)),
        );
      }

      console.log(response);
      clearSelectedBudgetId();
      closePopup();
      window.location.href = "/PagePrincipale";
    } catch (error) {
      console.error("Erreur lors de la création du budget:", error);
    }
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closePopup}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg rounded-lg bg-white p-6">
        <div className="flex items-center justify-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Nouveau mois = nouveau budget
          </h2>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            className="confirm-button py-2 px-4 rounded-lg"
            onClick={handleNewBudget}
          >
            Créer le budget
          </button>
        </div>
      </div>
    </div>
  );
}
