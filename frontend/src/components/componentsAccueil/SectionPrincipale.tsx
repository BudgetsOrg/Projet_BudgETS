export default function SectionPrincipale() {
  return (
    <div className="flex flex-row items-center p-4 justify-center bg-gradient-to-br from-black to-[var(--color-primary)] gap-8 mx-4 rounded-lg">
      <div className="flex flex-col gap-8 font-sans">
        <h1 className="text-7xl font-extrabold text-left bg-clip-text text-transparent bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-primary)]">
          Gérer
        </h1>
        <h1 className="text-7xl font-extrabold text-left bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-primary)] bg-clip-text text-transparent">
          Planifier
        </h1>
        <h1 className="text-7xl font-extrabold text-left bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-primary)] bg-clip-text text-transparent">
          Économiser
        </h1>
        <h1 className="text-7xl font-extrabold text-left bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-primary)] bg-clip-text text-transparent">
          Anticiper
        </h1>
      </div>
      <div className="flex flex-col items-end justify-end gap-4">
        <h2 className="text-2xl font-bold text-white">Notre but</h2>
        <p className="text-lg text-justify align-right text-white w-3/4">
          BudgETS est une application pour aider les étudiants à gérer leurs
          dépenses selon leurs besoins et atteindre leurs objectifs d'épargne.
        </p>
        <br />
        <p className="indent-8 text-lg text-justify align-right text-white w-3/4">
          Grâce à cette application, les utilisateurs peuvent être plus
          conscients de leurs habitudes de consommation.
        </p>
        <br />
        <p className="indent-8 text-lg text-justify align-right text-white w-3/4">
          Dans un monde où les dépenses peuvent facilement devenir
          incontrôlables, BudgETS offre une solution simple et efficace pour
          aider les étudiants à prendre le contrôle de leur budget et à
          planifier leur avenir financier.
        </p>
      </div>
    </div>
  );
}
