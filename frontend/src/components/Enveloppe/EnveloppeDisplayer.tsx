import { useEnveloppes } from "../../hooks/UseEnveloppes";
import { EnveloppeCard } from "./EnveloppeCard";

export function EnveloppesBudgetaires() {
  const { enveloppes, loading, error } = useEnveloppes();

  //Could be changed to a spinner or a cuter message
  if (loading) return <div>Chargement...</div>;

  if (error) return <div>Erreur: {error}</div>;

  if (enveloppes.length === 0)
    return <div>Vous n'avez présentement aucune enveloppe budgétaires. </div>;
  return (
    <div className="custom-scrollbar overflow-x-scroll">
      <div className="flex gap-4 pb-4">
        {enveloppes.map((env) => (
          <div key={env.id_enveloppe} className="flex-shrink-0 w-64">
            <EnveloppeCard {...env} />
          </div>
        ))}
      </div>
    </div>
  );
}
