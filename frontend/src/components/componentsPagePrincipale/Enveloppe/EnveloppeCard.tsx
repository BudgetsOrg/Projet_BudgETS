import type { Enveloppe } from "../../../interfaces";
import { useNavigate } from "react-router-dom";
import trash from "../../../img/trash.svg";
import { deleteEnveloppe } from "../../../api/EnveloppeApi";
interface EnveloppeCardProps extends Enveloppe {
  onSaved: () => void;
  readOnly?: boolean;
}

// rappel : onSaved() vient de EnveloppeDisplayer qui vient de pagePrincipale. Dans cette page, ça update le state +=1

export function EnveloppeCard({
  id_enveloppe,
  titre,
  montant,
  image,
  onSaved,
  readOnly,
}: EnveloppeCardProps) {
  // cliquer sur une enveloppe permet d'aller à la page, state donne les infos à la page enveloppe pour éviter de faire un fetch supplémentaire
  const navigate = useNavigate();

  // quand clique navigate à page enveloppe avec l'id de l'enveloppe
  const handleClick = () => {
    navigate(`/PageEnveloppe/${id_enveloppe}`, {
      state: { id_enveloppe, titre, montant },
    });
  };

  // quand delete, appeler api delete
  const handleDelete = async () => {
    if (readOnly) return;
    try {
      await deleteEnveloppe(id_enveloppe);
      onSaved();
    } catch (error) {
      console.log("Error deleting enveloppe:", error);
    }
  };

  return (
    <div
      // On donne un id à chaque carte enveloppe
      id={String(id_enveloppe)}
      className="rounded-xl overflow-hidden shadow-md flex flex-col h-64 hover:opacity-90 cursor-pointer shadow-lg transition-shadow duration-300"
      // quand clique, va à la fonction
      onClick={handleClick}
    >
      {/*le titre*/}
      <div className="flex flex-row justify-between bg-[var(--color-primary)] p-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">{titre}</h2>
        <button
          className={`bg-white rounded-full ${
            readOnly
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[var(--color-delete)]"
          }`}
          disabled={!!readOnly}
          onClick={(e) => {
            e.stopPropagation(); // Empêche de cliquer sur l'enveloppe quand clique sur delete
            handleDelete();
          }}
        >
          <img src={trash} alt="Supprimer" className="w-10 h-10" />
        </button>
      </div>
      <div
        className="flex-grow w-full"
        // style pour une carte!
        style={{
          backgroundImage: `url(${image})`,
          backgroundColor: "#ECEABE",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "200px",
        }}
      ></div>
    </div>
  );
}
