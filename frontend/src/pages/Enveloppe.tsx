// Mohamed
import { useState } from "react"; // npm install
import type { Depense } from "../interfaces.ts"; // ton interface est rendu dans la page pour ceux-ci
import { GraphiqueEnveloppe } from "../components/graphiqueEnveloppe.tsx"; // le graphique de la page enveloppe
// Plus tard gerer avec le backend.
const enveloppeId = 1;

const donneesInitiales = {
  titre: "Titre de mon enveloppe",
  budgetAlloue: 150,
  depenses: [
    {
      id: 1,
      titre: "MC Donalds",
      categorie: "Restaurant",
      prix: 15.0,
      date: "2026-10-10",
    },
    {
      id: 2,
      titre: "Uber",
      categorie: "Transport",
      prix: 25.0,
      date: "2026-10-11",
    },
  ],
};

function Enveloppe() {
  const [modalEditOuvert, setModalEditOuvert] = useState(false);

  const [editData, setEditData] = useState({
    titre: donneesInitiales.titre,
    budgetAlloue: donneesInitiales.budgetAlloue,
  });

  const budgetAlloue = editData.budgetAlloue;

  const [modeSupprimer, setModeSupprimer] = useState(false);
  const [selectionnes, setSelectionnes] = useState<number[]>([]);

  const [depenses, setDepenses] = useState<Depense[]>(
    donneesInitiales.depenses,
  );
  const [modalOuvert, setModalOuvert] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);
  const [indexEdition, setIndexEdition] = useState<number | null>(null);

  const [nouvelleDepense, setNouvelleDepense] = useState<Depense>({
    titre: "",
    categorie: "",
    prix: 0,
    date: "",
  });

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
    setModeEdition(false);
    setIndexEdition(null);
    setNouvelleDepense({ titre: "", categorie: "", prix: 0, date: "" });
  };

  // Lorsqu'on relie le backend au frontend on utilisera la version en bas.
  const confirmerAjout = () => {
    if (
      !nouvelleDepense.titre ||
      !nouvelleDepense.date ||
      nouvelleDepense.prix <= 0
    )
      return;

    if (modeEdition && indexEdition !== null) {
      const copie = [...depenses];
      copie[indexEdition] = nouvelleDepense;
      setDepenses(copie);
    } else {
      setDepenses([...depenses, nouvelleDepense]);
    }

    fermerModal();
  };
  // Lorsqu'on relie le backend et frontend on pourra utiliser ce code pour modifier le titre et la valeur du budget alloué pour l'enveloppe.
  /*
  //Lorsqu'on aura modifier pour utiliser cette version il va falloir changer le onClick du bouton confirmer pour qu'il appelle cette méthode à la place.
const confirmerEditEnveloppe = async () => {
  try {
    const res = await fetch(`http://localhost:8080/api/enveloppes/${enveloppeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
    });

    if (!res.ok) throw new Error("Erreur update");

    const data = await res.json();

    // met à jour le titre et le budget alloué avec la réponse backend
    setEditData(data);

    setModalEditOuvert(false);

  } catch (err) {
    console.error("Erreur :", err);
  }
};
*/

  // Lorsqu'on relie le backend ici on va pouvoir ajouter une dépense avec ce code.
  /*
 const confirmerAjout = async () => {
  if (!nouvelleDepense.titre || !nouvelleDepense.date || nouvelleDepense.prix <= 0) return;

  try {
    if (modeEdition && indexEdition !== null && nouvelleDepense.id) {
      // Modification d'une dépense existante
      await fetch(`http://localhost:8080/api/enveloppes/${enveloppeId}/depenses/${nouvelleDepense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouvelleDepense),
      });

      const copie = [...depenses];
      copie[indexEdition] = nouvelleDepense;
      setDepenses(copie);
    } else {
      // Création d'une nouvelle dépense (le backend génère l'id)
      const res = await fetch(`http://localhost:8080/api/enveloppes/${enveloppeId}/depenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouvelleDepense),
      });

      const data: Depense = await res.json(); // data contient maintenant l'id généré par le backend
      setDepenses([...depenses, data]);
    }

    fermerModal();
  } catch (err) {
    console.error("Erreur :", err);
  }
};
  */

  const handleEdit = (depense: Depense, index: number) => {
    setNouvelleDepense(depense);
    setIndexEdition(index);
    setModeEdition(true);
    setModalOuvert(true);
  };

  const activerModeSupprimer = () => {
    setModeSupprimer(true);
    setSelectionnes([]);
  };

  const annulerSupprimer = () => {
    setModeSupprimer(false);
    setSelectionnes([]);
  };

  const toggleSelection = (index: number) => {
    setSelectionnes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };
  const confirmerSuppression = () => {
    const nouvellesDepenses = depenses.filter(
      (_, i) => !selectionnes.includes(i),
    );

    setDepenses(nouvellesDepenses);
    setModeSupprimer(false);
    setSelectionnes([]);
  };

  //Lorsqu'on va relier avec le backend ici utiliser ce code pour supprimer les dépenses sélectionnées.
  /*
  const confirmerSuppression = async () => {
    try {
      for (const index of selectionnes) {
        const depense = depenses[index];
  
        if (depense.id) {
          await fetch(
            `http://localhost:8080/api/enveloppes/${enveloppeId}/depenses/${depense.id}`,
            { method: "DELETE" }
          );
        }
      }
  
      setDepenses(depenses.filter((_, i) => !selectionnes.includes(i)));
      setModeSupprimer(false);
      setSelectionnes([]);
  
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };*/

  return (
    <div className="enveloppe_container">
      <div className="enveloppe_header">
        <div className="enveloppe_header_gauche">
          <h1 className="enveloppe_titre">{editData.titre}</h1>
          <button
            className="enveloppe_edit"
            onClick={() => setModalEditOuvert(true)}
          >
            <img src="/img/edit.png"></img>
          </button>
        </div>

        <div className="enveloppe_budget">
          <span className="enveloppe_budget_label">Budget alloué :</span>
          <span className="enveloppe_budget_montant">
            {formatPrix(editData.budgetAlloue)}
          </span>
        </div>
      </div>

      <div className="enveloppe_barre_fond">
        <div
          className="enveloppe_barre_remplie"
          style={{ width: `${pourcentage}%` }}
        />
        <span className="enveloppe_barre_pourcentage">
          {Math.round(pourcentage)}%
        </span>
      </div>
      <div className="enveloppe_depenses_header">
        <h2>Dépenses</h2>

        <div className="enveloppe_depenses_actions">
          {!modeSupprimer ? (
            <>
              <button className="btn_ajouter" onClick={ouvrirModal}>
                Ajouter +
              </button>
              <div
                style={{
                  height: "25px",
                  backgroundColor: "#D9D9D9",
                  width: "4px",
                }}
              />

              <button className="btn_supprimer" onClick={activerModeSupprimer}>
                Supprimer
              </button>
            </>
          ) : (
            <>
              <button className="btn_ajouter" onClick={confirmerSuppression}>
                Confirmer ({selectionnes.length})
              </button>

              <button className="btn_supprimer" onClick={annulerSupprimer}>
                Annuler
              </button>
            </>
          )}
        </div>
      </div>
      <div className="table_wrapper">
        <table className="enveloppe_table">
          <thead>
            <tr>
              {modeSupprimer && <th></th>}
              <th>Titre</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Date</th>
              {!modeSupprimer && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {depenses.map((depense, index) => (
              <>
                <tr key={index}>
                  {modeSupprimer && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectionnes.includes(index)}
                        onChange={() => toggleSelection(index)}
                      />
                    </td>
                  )}
                  <td>{depense.titre}</td>
                  <td>{depense.categorie}</td>
                  <td>{formatPrix(depense.prix)}</td>
                  <td>{formatDate(depense.date)}</td>

                  {!modeSupprimer && (
                    <td className="cell_actions">
                      <button
                        className="btn_modifier"
                        onClick={() => handleEdit(depense, index)}
                      >
                        Modifier
                      </button>
                    </td>
                  )}
                </tr>
                <tr>
                  <td colSpan={modeSupprimer ? 6 : 5}>
                    <div
                      style={{
                        height: "5px",
                        backgroundColor: "#D9D9D9",
                        width: "100%",
                      }}
                    />
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* PopUp */}
      {modalOuvert && (
        <div className="modal_overlay" onClick={fermerModal}>
          <div className="modal_contenu" onClick={(e) => e.stopPropagation()}>
            <h2>{modeEdition ? "Modifier" : "Ajouter"} une dépense</h2>

            <input
              placeholder="Titre"
              value={nouvelleDepense.titre}
              onChange={(e) =>
                setNouvelleDepense({
                  ...nouvelleDepense,
                  titre: e.target.value,
                })
              }
            />

            <input
              placeholder="Catégorie"
              value={nouvelleDepense.categorie}
              onChange={(e) =>
                setNouvelleDepense({
                  ...nouvelleDepense,
                  categorie: e.target.value,
                })
              }
            />

            <input
              type="number"
              value={nouvelleDepense.prix || ""}
              onChange={(e) =>
                setNouvelleDepense({
                  ...nouvelleDepense,
                  prix: parseFloat(e.target.value),
                })
              }
            />

            <input
              type="date"
              value={nouvelleDepense.date}
              onChange={(e) =>
                setNouvelleDepense({ ...nouvelleDepense, date: e.target.value })
              }
            />

            <div className="modal_boutons">
              <button className="btn_ajouter" onClick={confirmerAjout}>
                {modeEdition ? "Modifier" : "Ajouter"}
              </button>

              <button className="btn_supprimer" onClick={fermerModal}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop Up edit Titre / Valeur du budget alloué */}
      {modalEditOuvert && (
        <div
          className="modal_overlay"
          onClick={() => setModalEditOuvert(false)}
        >
          <div className="modal_contenu" onClick={(e) => e.stopPropagation()}>
            <h2>Modifier l'enveloppe</h2>

            <input
              placeholder="Titre"
              value={editData.titre}
              onChange={(e) =>
                setEditData({ ...editData, titre: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Budget"
              value={editData.budgetAlloue}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  budgetAlloue: parseFloat(e.target.value),
                })
              }
            />

            <div className="modal_boutons">
              <button
                className="btn_ajouter"
                onClick={() => setModalEditOuvert(false)}
              >
                Confirmer
              </button>

              <button
                className="btn_supprimer"
                onClick={() => setModalEditOuvert(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-10">
        <GraphiqueEnveloppe />
      </div>
    </div>
  );
}

export default Enveloppe;
