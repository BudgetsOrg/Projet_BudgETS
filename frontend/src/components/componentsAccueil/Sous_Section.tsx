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
              <img className="w-40 h-40" src={cashCoins} alt="Cash and coins" />
              <div>
                <h3 className="font-bold">
                  Épargnez en enveloppes pour le mois
                </h3>
                <p className="text-[var(--color-primary)]">
                  À chaque mois, vous pouvez épargnez vos dépenses dans des
                  enveloppes afin de savoir combien vous avez dépensé dans
                  chaque catégorie. Vous pouvez vous fixer des montants maximum
                  par mois, et ce, pour chaque catégorie d'enveloppes.
                </p>
              </div>
            </div>
          </div>
          {/*deuxième case */}
          <div className="bg-[#E6DFD0] rounded-lg p-2 mb-4 ml-20 flex flex-col w-full">
            <div className="flex flex-row">
              <img src={safe} alt="Safe" />
              <div>
                <h3 className="font-bold">
                  Atteignez vos objectifs financiers
                </h3>
                <p className="text-[var(--color-primary)]">
                  Vous pouvez vous créer des objectifs à court ou long terme,
                  seul ou avec des amis, pour vous motiver à les atteindre et
                  rendre le tout plus atteignable.
                </p>
              </div>
            </div>
          </div>
          {/*troisième case */}
          <div className="bg-[#E6DFD0] rounded-lg p-2 mb-4 ml-6 flex flex-col w-full">
            <div className="flex flex-row">
              <img src={checklist} alt="Checklist" />
              <div>
                <h3 className="font-bold">Suivez vos dépenses</h3>
                <p className="text-[var(--color-primary)]">
                  Chaque dépense peut être catégorisée et suivie pour vous aider
                  à rester sur la bonne voie. Il est plus facile de voir dans
                  quoi vous dépensez et alors savoir où couper.
                </p>
              </div>
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
