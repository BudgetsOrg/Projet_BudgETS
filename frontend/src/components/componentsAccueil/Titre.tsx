import Vector_1 from "../../../public/img/Vector_1.png";
export default function Titre() {
  return (
    <div className="flex flex-col items-center justify-center pt-30">
      <img src={Vector_1} alt="Statistics" className="w-full h-25" />
      <div className="relative pt-10 text-left">
        <h1 className="text-6xl font-bold">BudgETS</h1>
        <p className="text-lg text-[var(--color-primary)] indent-8 mt-4">
          Votre application de gestion de budget pour les étudiants
        </p>
      </div>
    </div>
  );
}
