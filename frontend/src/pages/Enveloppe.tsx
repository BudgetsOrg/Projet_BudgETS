// Mohamed
import { useState, useEffect } from "react"; // npm install
import type { Depense } from "../interfaces"; // ton interface est rendu dans la page pour ceux-ci
import { GraphiqueEnveloppe } from "../components/graphiques/graphiqueEnveloppe.tsx"; // le graphique de la page enveloppe
import { getToken } from "../../public/token.ts";
import {
  getDepenses,
  postDepense,
  deleteDepense,
  updateDepense,
} from "../api/DepenseApi.ts";
import img_edit from "../img/edit.png";
import addPhotoIcon from "../img/add_photo_alternate_outlined.svg";
import { useLocation } from "react-router-dom";
import { getEnveloppeById, updateEnveloppe } from "../api/EnveloppeApi.ts";
import { useCloudinaryImage } from "../hooks/useCloudinaryImage";

function Enveloppe() {
  // pour récupérer le id de l'enveloppe à partir de la page précédente
  const location = useLocation();
  const id_enveloppe = location.state?.id_enveloppe;
  const titre = location.state?.titre ?? "";
  const montantEnveloppe = Number(location.state?.montant) || 0;
  const imageInitiale = location.state?.image ?? "";

  const [editDataSauvegarde, setEditDataSauvegarde] = useState({
    titre: "",
    budgetAlloue: 0,
    image: "",
  });
  const [editData, setEditData] = useState({
    titre: titre,
    budgetAlloue: montantEnveloppe,
    image: imageInitiale,
  });
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [modalEditOuvert, setModalEditOuvert] = useState(false);
  const [modeSupprimer, setModeSupprimer] = useState(false);
  const [selectionnes, setSelectionnes] = useState<number[]>([]);
  const [modalOuvert, setModalOuvert] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);
  const [indexEdition, setIndexEdition] = useState<number | null>(null);
  const [nouvelleDepense, setNouvelleDepense] = useState<Depense>({
    id_depense: 0,
    nom_depense: "",
    montant: 0,
    date: "",
    recurente: false,
    enveloppeId: id_enveloppe,
    categorieId: 0,
  });

  const {
    previewUrl: previewImageEnveloppe,
    file: fichierImageEnveloppe,
    uploading: uploadImageEnveloppeEnCours,
    error: erreurUploadImageEnveloppe,
    onFileChange: onFileChangeImageEnveloppe,
    upload: uploadImageEnveloppe,
    reset: resetImageEnveloppe,
  } = useCloudinaryImage({ initialUrl: imageInitiale, folder: "enveloppes" });

  const modifierInformationEnveloppe = async () => {
    try {
      let image = editData.image;

      if (fichierImageEnveloppe) {
        const uploadedUrl = await uploadImageEnveloppe();
        if (uploadedUrl) {
          image = uploadedUrl;
        }
      }

      await updateEnveloppe({
        id_enveloppe: id_enveloppe,
        titre: editData.titre,
        montant: editData.budgetAlloue,
        image,
      });
      setEditData((prev) => ({ ...prev, image }));
      setModalEditOuvert(false);
    } catch (error: any) {
      console.log(
        "La modification de l'enveloppe à causée une erreur :",
        error.message,
      );
    }
  };
  useEffect(() => {
    const recupererEnveloppe = async () => {
      try {
        const data = await getEnveloppeById(id_enveloppe);
        setEditData({
          titre: data.titre,
          budgetAlloue: Number(data.montant) || 0,
          image: data.image || "",
        });
        resetImageEnveloppe(data.image || "");
      } catch (error: any) {
        console.error(error);
      }
    };
    if (id_enveloppe) recupererEnveloppe();
  }, []);

  useEffect(() => {
    const recupererDepenses = async () => {
      try {
        const data: Depense[] = await getDepenses(id_enveloppe);

        if (!Array.isArray(data)) {
          console.error("Réponse inattendue :", data);
          alert("Erreur : impossible de charger les dépenses");
          return;
        }
        const dataConverti = data.map((d: any) => ({
          ...d,
          montant: parseFloat(d.montant) || 0,
        }));

        console.log("Dépenses reçues :", data);
        setDepenses(dataConverti);
      } catch (error: any) {
        console.error(error);
        alert(error.message);
      }
    };
    recupererDepenses();
  }, []);

  const budgetAlloue = editData.budgetAlloue;
  const totalDepenses = depenses.reduce((acc, d) => acc + (d.montant || 0), 0);
  const pourcentage =
    budgetAlloue > 0 ? Math.min((totalDepenses / budgetAlloue) * 100, 100) : 0;

  const formatPrix = (prix: number | undefined) => {
    if (prix === undefined || prix === null || isNaN(prix)) return "0,00$";
    return Number(prix).toFixed(2).replace(".", ",") + "$";
  };
  const formatDate = (date: string) => {
    if (!date) return "";
    // Prend seulement la partie date avant le T
    const dateSeulement = date.split("T")[0];
    const [annee, mois, jour] = dateSeulement.split("-");
    return `${jour}/${mois}/${annee}`;
  };

  const ouvrirModal = () => setModalOuvert(true);

  const fermerModal = () => {
    setModalOuvert(false);
    setModeEdition(false);
    setIndexEdition(null);
    setNouvelleDepense({
      id_depense: 0,
      nom_depense: "",
      montant: 0,
      date: "",
      recurente: false,
      enveloppeId: id_enveloppe,
      categorieId: 0,
    });
  };

  const couleurBarre = (pct: number): string => {
    // Interpolation jaune (#e6b800) → orange (#e8442a)
    const r = Math.round(230 + (232 - 230) * (pct / 100));
    const g = Math.round(184 + (68 - 184) * (pct / 100));
    const b = Math.round(0 + (42 - 0) * (pct / 100));
    return `rgb(${r}, ${g}, ${b})`;
  };
  // Lorsqu'on relie le backend au frontend on utilisera la version en bas.
  const confirmerAjout = async () => {
    if (
      !nouvelleDepense.nom_depense ||
      !nouvelleDepense.date ||
      nouvelleDepense.montant <= 0
    )
      return;

    if (modeEdition && indexEdition !== null) {
      try {
        console.log("Dépense à modifier :", nouvelleDepense);
        await updateDepense(nouvelleDepense);
        const data = await getDepenses(id_enveloppe);
        if (Array.isArray(data)) {
          const dataConverti = data.map((d: any) => ({
            ...d,
            montant: parseFloat(d.montant) || 0,
          }));
          setDepenses(dataConverti);
        }
      } catch (error: any) {
        console.log("Erreur dans la modification d'une dépense : ", error);
        return;
      }
    } else {
      try {
        await postDepense(nouvelleDepense);
        const data = await getDepenses(id_enveloppe);
        if (Array.isArray(data)) {
          const dataConverti = data.map((d: any) => ({
            ...d,
            montant: parseFloat(d.montant) || 0,
          }));
          setDepenses(dataConverti);
        }
      } catch (error: any) {
        console.log(error);
        alert("Erreur lors de l'ajout de la depense : " + error.message);
        return;
      }
    }

    fermerModal();
  };

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
  const confirmerSuppression = async () => {
    try {
      for (const index of selectionnes) {
        const depense = depenses[index];
        if (depense.id_depense) {
          await deleteDepense(depense.id_depense);
        }
      }
      const data = await getDepenses(id_enveloppe);
      if (Array.isArray(data)) {
        const dataConverti = data.map((d: any) => ({
          ...d,
          montant: parseFloat(d.montant) || 0,
        }));
        setDepenses(dataConverti);
      }
    } catch (error: any) {
      console.error(error);
      alert("Erreur lors de la suppression : " + error.message);
    }

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
            onClick={() => {
              setEditDataSauvegarde({ ...editData });
              resetImageEnveloppe(editData.image || "");
              setModalEditOuvert(true);
            }}
          >
            <img src={img_edit}></img>
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
          style={{
            width: `${pourcentage}%`,
            backgroundColor: couleurBarre(pourcentage),
          }}
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
              <div
                style={{
                  height: "25px",
                  backgroundColor: "#D9D9D9",
                  width: "4px",
                }}
              />
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
              <th>Nom</th>
              <th>Montant</th>
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
                  <td>{depense.nom_depense}</td>
                  <td>{formatPrix(depense.montant)}</td>
                  <td>{formatDate(depense.date ?? "")}</td>

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
              placeholder="Nom de la dépense"
              value={nouvelleDepense.nom_depense}
              onChange={(e) =>
                setNouvelleDepense({
                  ...nouvelleDepense,
                  nom_depense: e.target.value,
                })
              }
            />
            <input
              placeholder="Montant"
              type="number"
              value={nouvelleDepense.montant || ""}
              onChange={(e) =>
                setNouvelleDepense({
                  ...nouvelleDepense,
                  montant: parseFloat(e.target.value) || 0,
                })
              }
            />

            <input
              type="date"
              value={nouvelleDepense.date?.split("T")[0] ?? ""}
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
                  budgetAlloue: parseFloat(e.target.value) || 0,
                })
              }
            />

            <div className="flex flex-col gap-2 mt-4">
              <span>Image de l'enveloppe</span>
              <div
                className="w-32 h-20 rounded-lg bg-cover bg-center border border-dashed border-gray-400 cursor-pointer flex items-center justify-center bg-gray-50"
                style={
                  previewImageEnveloppe || editData.image
                    ? {
                        backgroundImage: `url(${previewImageEnveloppe || editData.image || ""})`,
                        borderStyle: "solid",
                      }
                    : undefined
                }
                onClick={() => {
                  const input = document.getElementById(
                    "enveloppe-image-input",
                  );
                  input?.click();
                }}
              >
                {!previewImageEnveloppe && !editData.image && (
                  <img
                    src={addPhotoIcon}
                    alt="Ajouter une image"
                    className="w-10 h-10 opacity-70"
                  />
                )}
              </div>
              <input
                id="enveloppe-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChangeImageEnveloppe}
              />
              {erreurUploadImageEnveloppe && (
                <span className="text-red-500 text-sm">
                  {erreurUploadImageEnveloppe}
                </span>
              )}
            </div>

            <div className="modal_boutons">
              <button
                className="btn_ajouter"
                onClick={modifierInformationEnveloppe}
                disabled={uploadImageEnveloppeEnCours}
              >
                {uploadImageEnveloppeEnCours
                  ? "Enregistrement..."
                  : "Confirmer"}
              </button>

              <button
                className="btn_supprimer"
                onClick={() => {
                  setEditData({ ...editDataSauvegarde });
                  setModalEditOuvert(false);
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-10">
        <GraphiqueEnveloppe depenses={depenses} />
      </div>
    </div>
  );
}

export default Enveloppe;
