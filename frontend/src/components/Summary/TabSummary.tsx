import { useEnveloppes } from "../../hooks/UseEnveloppes";

export function TabSummary() {
  const { enveloppes, loading, error } = useEnveloppes();

  //Could be changed to a spinner or a cuter message
  if (loading) return <div>Chargement...</div>;

  if (error) return <div>Erreur: {error}</div>;
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 my-4">
        Solde pour le mois: {sumSolde(enveloppes)}
      </h3>
      <table className="w-full text-left table-auto min-w-max text-slate-800">
        <tr>
          <th>
            <span className="px-3 py-1 text-xs rounded-full bg-[var(--color-primary)] text-white">
              Mes différentes enveloppes budgétaires
            </span>
          </th>
        </tr>
        {enveloppes.map((env) => (
          <tr key={env.id_enveloppe}>
            <td className="p-4">{env.titre}</td>
            <td className="p-4">{env.montant} $</td>
          </tr>
        ))}
        <tr>
          <td className="p-4 " colSpan={2}>
            <button className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg">
              Creer une enveloppe
            </button>
          </td>
        </tr>
      </table>
    </div>
  );
}

function sumSolde(enveloppes: any) {
  let solde = 0;
  enveloppes.forEach((env: any) => {
    solde += env.montant;
  });
  return solde;
}
