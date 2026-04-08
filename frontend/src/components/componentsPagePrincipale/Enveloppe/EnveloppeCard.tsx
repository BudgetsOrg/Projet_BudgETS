import type { Enveloppe } from "../../../interfaces";
import trash from "../../../../public/img/trash.svg";
export function EnveloppeCard(enveloppe: Enveloppe) {
  return (
    <div
      id={String(enveloppe.id_enveloppe)}
      className="rounded-xl overflow-hidden shadow-md flex flex-col h-64 hover:opacity-90 cursor-pointer shadow-lg transition-shadow duration-300"
    >
      {/*le titre*/}
      <div className="flex flex-row justify-between bg-[var(--color-primary)] p-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">{enveloppe.titre}</h2>
        <button className="bg-white hover:bg-[var(--color-delete)] rounded-full">
          <img src={trash} alt="Supprimer" className="w-10 h-10" />
        </button>
      </div>
      <div
        className="flex-grow w-full"
        // style de l'image de fond, car dynamique{enveloppe.image} doit être dans in-line style au lieu de className
        style={{
          backgroundImage: `url(${enveloppe.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "200px",
        }}
      ></div>
    </div>
  );
}
