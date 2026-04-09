import type { Enveloppe } from "../../../interfaces";
import trash from "../../../../public/img/trash.svg";
import { deleteEnveloppe } from "../../../api/EnveloppeApi";
export function EnveloppeCard(props: Enveloppe & { onSaved: () => void }) {
  const { id_enveloppe, titre, image, onSaved } = props;
  return (
    <div
      id={String(id_enveloppe)}
      className="rounded-xl overflow-hidden shadow-md flex flex-col h-64 hover:opacity-90 cursor-pointer shadow-lg transition-shadow duration-300"
    >
      {/*le titre*/}
      <div className="flex flex-row justify-between bg-[var(--color-primary)] p-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">{titre}</h2>
        <button
          className="bg-white hover:bg-[var(--color-delete)] rounded-full"
          onClick={() => handleDelete(id_enveloppe, onSaved)}
        >
          <img src={trash} alt="Supprimer" className="w-10 h-10" />
        </button>
      </div>
      <div
        className="flex-grow w-full"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "200px",
        }}
      ></div>
    </div>
  );
}

async function handleDelete(id_enveloppe: number, onSaved: () => void) {
  try {
    await deleteEnveloppe(id_enveloppe);
    onSaved();
    // Refresh all displays
    if ((window as any).refreshTabSummary) {
      (window as any).refreshTabSummary();
    }
    if ((window as any).refreshEnveloppeDisplayer) {
      (window as any).refreshEnveloppeDisplayer();
    }
  } catch (error) {
    console.log("Error deleting enveloppe:", error);
  }
}
