import type { Enveloppe } from "../../../interfaces";
import { useNavigate } from "react-router-dom";
import trash from "../../../img/trash.svg";
import { deleteEnveloppe } from "../../../api/EnveloppeApi";
interface EnveloppeCardProps extends Enveloppe {
  onSaved: () => void;
}

export function EnveloppeCard({
  id_enveloppe,
  titre,
  image,
  onSaved,
}: EnveloppeCardProps) {
  // cliquer sur env permet d'aller à la page, state donne le id à l'enveloppe
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/enveloppe/${id_enveloppe}`, { state: { id_enveloppe } });
  };

  const handleDelete = async () => {
    try {
      await deleteEnveloppe(id_enveloppe);
      onSaved();
    } catch (error) {
      console.log("Error deleting enveloppe:", error);
    }
  };
  return (
    <div
      id={String(id_enveloppe)}
      className="rounded-xl overflow-hidden shadow-md flex flex-col h-64 hover:opacity-90 cursor-pointer shadow-lg transition-shadow duration-300"
      onClick={handleClick}
    >
      {/*le titre*/}
      <div className="flex flex-row justify-between bg-[var(--color-primary)] p-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">{titre}</h2>
        <button
          className="bg-white hover:bg-[var(--color-delete)] rounded-full"
          onClick={(e) => {
            e.stopPropagation(); // Prevents clicking the card when clicking the trash
            handleDelete();
          }}
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
