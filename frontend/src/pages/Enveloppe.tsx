// Mohamed
import { useState } from "react";

interface Depense {
  titre: string;
  categorie: string;
  prix: number;
  date: string;
}

interface DonneesEnveloppe {
  titre: string;
  budgetAlloue: number;
  depenses: Depense[];
}

const donneesInitiales: DonneesEnveloppe = {
  titre: "Titre de mon enveloppe",
  budgetAlloue: 150,

  /*
    // Pour recuperer les depenses de la db.
  useEffect(() => {
    fetch("/api/depenses")
      .then(res => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((data: Depense[]) => {
        setDepenses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Impossible de charger les dépenses");
        setLoading(false);
      });
  }, []);
  */
  depenses: [
    { titre: "MC Donalds", categorie: "Restaurant", prix: 15.00, date: "2026-10-10" },
    { titre: "MC Donalds", categorie: "Restaurant", prix: 15.00, date: "2026-10-10" },
    { titre: "MC Donalds", categorie: "Restaurant", prix: 15.00, date: "2026-10-10" },
  ],
};

function Enveloppe() {
  const { titre, budgetAlloue } = donneesInitiales;

  const [depenses, setDepenses] = useState<Depense[]>(donneesInitiales.depenses);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [nouvelleDepense, setNouvelleDepense] = useState<Depense>({ titre: "", categorie: "", prix: 0, date: "" });
  const [modeSupprimer, setModeSupprimer] = useState(false);
  const [selectionnes, setSelectionnes] = useState<number[]>([]);

  const totalDepenses = depenses.reduce((acc, d) => acc + d.prix, 0);
  const pourcentage = Math.min((totalDepenses / budgetAlloue) * 100, 100);

  const formatPrix = (prix: number) => prix.toFixed(2).replace(".", ",") + "$";
  const formatDate = (date: string) => {
    const [annee, mois, jour] = date.split("-");
    return `${jour}/${mois}/${annee}`;
  };

  const ouvrirModal = () => setModalOuvert(true);
  const fermerModal = () => {
    setModalOuvert(false);
    setNouvelleDepense({ titre: "", categorie: "", prix: 0, date: "" });
  };
  const confirmerAjout = () => {
    if (!nouvelleDepense.titre || !nouvelleDepense.date || nouvelleDepense.prix <= 0) return;
    /*
    //Pour ajouter a la db notre nouvelle depense mise dans le form.
      fetch("http://localhost:8080/api/depenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nouvelleDepense)
  })
    .then(res => res.json())
    .then(data => {
      setDepenses([...depenses, data]);
      fermerModal();
    })
    .catch(err => console.error("Erreur :", err));
};
    */ 
    setDepenses([...depenses, nouvelleDepense]);
    fermerModal();
  };

  const activerModeSupprimer = () => { setModeSupprimer(true); setSelectionnes([]); };
  const annulerSupprimer = () => { setModeSupprimer(false); setSelectionnes([]); };
  const toggleSelection = (index: number) => {
    setSelectionnes(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };
  const confirmerSuppression = () => {
    setDepenses(depenses.filter((_, i) => !selectionnes.includes(i)));
    setModeSupprimer(false);
    setSelectionnes([]);
  };

  return (
    <div className="enveloppe_container">

      <div className="enveloppe_header">
        <h1 className="enveloppe_titre">{titre}</h1>
        <div className="enveloppe_budget">
          <span className="enveloppe_budget_label">Budget alloué :</span>
          <span className="enveloppe_budget_montant">{formatPrix(budgetAlloue)}</span>
        </div>
      </div>

      <div className="enveloppe_barre_fond">
        <div className="enveloppe_barre_remplie" style={{ width: `${pourcentage}%` }} />
        <span className="enveloppe_barre_pourcentage">{Math.round(pourcentage)}%</span>
      </div>

      <div className="enveloppe_depenses">
        <div className="enveloppe_depenses_header">
          <h2 className="enveloppe_depenses_titre">Dépenses</h2>
          <div className="enveloppe_depenses_actions">
            {!modeSupprimer ? (
              <>
                <button className="btn_ajouter" onClick={ouvrirModal}>Ajouter +</button>
                <button className="btn_supprimer" onClick={activerModeSupprimer}>Supprimer</button>
              </>
            ) : (
              <>
                <button className="btn_ajouter" onClick={confirmerSuppression} disabled={selectionnes.length === 0}>
                  Confirmer ({selectionnes.length})
                </button>
                <button className="btn_supprimer" onClick={annulerSupprimer}>Annuler</button>
              </>
            )}
          </div>
        </div>

        <table className="enveloppe_table">
          <thead>
            <tr>
              {modeSupprimer && <th></th>}
              <th>Titre</th>
              <th>Categorie</th>
              <th>Prix</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {depenses.map((depense, index) => (
              <tr
                key={index}
                onClick={() => modeSupprimer && toggleSelection(index)}
                className={modeSupprimer ? (selectionnes.includes(index) ? "ligne_selectionnee" : "ligne_supprimable") : ""}
              >
                {modeSupprimer && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectionnes.includes(index)}
                      onChange={() => toggleSelection(index)}
                      onClick={e => e.stopPropagation()}
                    />
                  </td>
                )}
                <td>{depense.titre}</td>
                <td>{depense.categorie}</td>
                <td>{formatPrix(depense.prix)}</td>
                <td>{formatDate(depense.date)}</td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 5 - depenses.length) }).map((_, i) => (
              <tr key={`vide-${i}`} className="ligne_vide">
                {modeSupprimer && <td></td>}
                <td></td><td></td><td></td><td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOuvert && (
        <div className="modal_overlay" onClick={fermerModal}>
          <div className="modal_contenu" onClick={e => e.stopPropagation()}>
            <h2>Ajouter une dépense</h2>
            <label>Titre</label>
            <input type="text" placeholder="Ex: MC Donalds"
              value={nouvelleDepense.titre}
              onChange={e => setNouvelleDepense({ ...nouvelleDepense, titre: e.target.value })}
            />
            <label>Catégorie</label>
            <input type="text" placeholder="Ex: Restaurant"
              value={nouvelleDepense.categorie}
              onChange={e => setNouvelleDepense({ ...nouvelleDepense, categorie: e.target.value })}
            />
            <label>Prix ($)</label>
            <input type="number" placeholder="Ex: 15.00" min="0"
              value={nouvelleDepense.prix || ""}
              onChange={e => setNouvelleDepense({ ...nouvelleDepense, prix: parseFloat(e.target.value) })}
            />
            <label>Date</label>
            <input type="date"
              value={nouvelleDepense.date}
              onChange={e => setNouvelleDepense({ ...nouvelleDepense, date: e.target.value })}
            />
            <div className="modal_boutons">
              <button className="btn_ajouter" onClick={confirmerAjout}>Confirmer</button>
              <button className="btn_supprimer" onClick={fermerModal}>Annuler</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Enveloppe;