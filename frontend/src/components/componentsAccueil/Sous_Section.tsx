import planteAccueil from "../../../public/img/planteAccueil.png";
import cashCoins from "../../../public/img/Cash_and_coins.png";
import checklist from "../../../public/img/check_list_with_credit_card_and_coins.png";
import safe from "../../../public/img/safe_green.png";
export default function Sous_Section() {
  return (
    // container de la section
    <div className="gap-8 pt-20">
      {/* titre de la section */}
      <h2 className="text-4xl font-bold text-left ml-6 mb-12">
        Pourquoi choisir BudgETS ?
      </h2>
      {/* contient les trois cases et la grosse image de la plante */}
      <div className="flex flex-row">
        {/* contient les trois cases */}
        <div className="flex flex-col items-start justify-start gap-4 w-full">
          {/* première case */}
          <div className="bg-[#E6DFD0] rounded-lg p-2 mb-4 ml-6 flex flex-col w-full">
            <div className="flex flex-row">
              <img src={cashCoins} alt="Cash and coins" />
              <h3 className="font-bold">Épargnez en enveloppes pour le mois</h3>
              <p></p>
            </div>
          </div>
          {/*deuxième case */}
          <div className="bg-[#E6DFD0] rounded-lg p-2 mb-4 ml-20 flex flex-col w-full">
            <div className="flex flex-row">
              <img src={safe} alt="Safe" />
              <h3 className="font-bold">Atteignez vos objectifs financiers</h3>
            </div>
            <p></p>
          </div>
          {/*troisième case */}
          <div className="bg-[#E6DFD0] rounded-lg p-2 mb-4 ml-6 flex flex-col w-full">
            <div className="flex flex-row">
              <img src={checklist} alt="Checklist" />
              <h3 className="font-bold">
                Suivez vos dépenses et vos objectifs
              </h3>
              <p></p>
            </div>
          </div>
        </div>
        {/* grosse image de la plante */}
        <div className="flex items-end justify-end w-full">
          <img src={planteAccueil} alt="Plante d'accueil" />
        </div>
      </div>
    </div>
  );
}
