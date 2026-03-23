// Mohamed
//Justine = diagramme

// Composant Enveloppe
// Affiche le détail d'une enveloppe budgétaire avec ses dépenses

//À changer plus tard pour récupérer les données d'une enveloppe depuis le backend.

interface Depense {
  titre: string;
  categorie: string;
  prix: number;
  date: string;
}
//À changer plus tard pour récupérer les données d'une enveloppe depuis le backend.
interface DonneesEnveloppe {
  titre: string;
  budgetAlloue: number;
  depenses: Depense[];
}

const donneesEnveloppe: DonneesEnveloppe = {
  titre: "Titre de mon enveloppe",
  budgetAlloue: 150,
  depenses: [
    { titre: "MC Donalds", categorie: "Restaurant", prix: 15.00, date: "2026-10-10" },
    { titre: "MC Donalds", categorie: "Restaurant", prix: 15.00, date: "2026-10-10" },
    { titre: "MC Donalds", categorie: "Restaurant", prix: 15.00, date: "2026-10-10" },
  ],
};

function Enveloppe() {
  const { titre, budgetAlloue, depenses } = donneesEnveloppe;

  const onAjouter   = (): void => console.log("Ajouter une dépense");
  const onSupprimer = (): void => console.log("Supprimer une dépense");

  const totalDepenses: number = depenses.reduce((acc, d) => acc + d.prix, 0);
  const pourcentage: number = Math.min((totalDepenses / budgetAlloue) * 100, 100);

  const formatPrix = (prix: number): string =>
    prix.toFixed(2).replace(".", ",") + "$";

  const formatDate = (date: string): string => {
    const [annee, mois, jour] = date.split("-");
    return `${jour}/${mois}/${annee}`;
  };

  return (
    <div className="enveloppe_container">

      {/* En-tête */}
      <div className="enveloppe_header">
        <h1 className="enveloppe_titre">{titre}</h1>
        <div className="enveloppe_budget">
          <span className="enveloppe_budget_label">Budget alloué :</span>
          <span className="enveloppe_budget_montant">{formatPrix(budgetAlloue)}</span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="enveloppe_barre_fond">
        <div
          className="enveloppe_barre_remplie"
          style={{ width: `${pourcentage}%` }}
        />
        <span className="enveloppe_barre_pourcentage">{Math.round(pourcentage)}%</span>
      </div>

      {/* Section dépenses */}
      <div className="enveloppe_depenses">
        <div className="enveloppe_depenses_header">
          <h2 className="enveloppe_depenses_titre">Depense</h2>
          <div className="enveloppe_depenses_actions">
            <button className="btn_ajouter" onClick={onAjouter}>Ajouter +</button>
            <button className="btn_supprimer" onClick={onSupprimer}>Supprimer</button>
          </div>
        </div>

        {/* Tableau */}
        <table className="enveloppe_table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Categorie</th>
              <th>Prix</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {depenses.map((depense: Depense, index: number) => (
              <tr key={index}>
                <td>{depense.titre}</td>
                <td>{depense.categorie}</td>
                <td>{formatPrix(depense.prix)}</td>
                <td>{formatDate(depense.date)}</td>
              </tr>
            ))}
            {/* Lignes vides pour remplir le tableau visuellement */}
            {Array.from({ length: Math.max(0, 5 - depenses.length) }).map((_, i: number) => (
              <tr key={`vide-${i}`} className="ligne_vide">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Enveloppe;