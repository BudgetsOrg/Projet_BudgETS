// Composant Objectif
// Affiche le détail d'un objectif d'épargne avec image de couverture et invitation par email

import { useState, useRef } from "react";
import imgEdit from "../img/edit.png";
import { BackgroundColor } from "devextreme-react/cjs/chart";
import GraphiqueObjectif from "../components/graphiques/graphiqueObjectif";

interface Economie {
  id: number;
  montant: number;
  date: string;
}

interface DonneesObjectif {
  titre: string;
  montantACumuler: number;
  imageUrl: string | null;
  economies: Economie[];
}

const donneesObjectif: DonneesObjectif = {
  titre: "Titre de mon Objectif",
  montantACumuler: 11150,
  imageUrl: null,
  economies: [
    { id: 1, montant: 15.0, date: "2026-10-19" },
    { id: 2, montant: 205.0, date: "2026-10-13" },
    { id: 3, montant: 15.0, date: "2026-10-10" },
    { id: 4, montant: 115.0, date: "2026-10-02" },
  ],
};

type TypePopup = "invitation" | "ajouter" | "edition" | null;

function Objectif() {
  // État principal
  const [titre, setTitre] = useState<string>(donneesObjectif.titre);
  const [montantACumuler, setMontantACumuler] = useState<number>(
    donneesObjectif.montantACumuler,
  );
  const [imageUrl, setImageUrl] = useState<string | null>(
    donneesObjectif.imageUrl,
  );
  const [economies, setEconomies] = useState<Economie[]>(
    donneesObjectif.economies,
  );

  //  Mode supprimer (même pattern qu'Enveloppe)
  const [modeSupprimer, setModeSupprimer] = useState<boolean>(false);
  const [selectionnes, setSelectionnes] = useState<number[]>([]);

  // Popups
  const [popupOuvert, setPopupOuvert] = useState<TypePopup>(null);

  //  Popup Invitation
  const [email, setEmail] = useState<string>("");
  const [emailEnvoye, setEmailEnvoye] = useState<boolean>(false);

  // Popup Ajouter
  const [nouveauMontant, setNouveauMontant] = useState<string>("");
  const [nouvelleDate, setNouvelleDate] = useState<string>("");

  // Popup Édition
  const [editTitre, setEditTitre] = useState<string>(titre);
  const [editMontant, setEditMontant] = useState<string>(
    String(montantACumuler),
  );
  const [editImageUrl, setEditImageUrl] = useState<string | null>(imageUrl);
  const editImageRef = useRef<HTMLInputElement>(null);
  const inputImageRef = useRef<HTMLInputElement>(null);

  //  Calculs
  const totalEconomies: number = economies.reduce(
    (acc, e) => acc + e.montant,
    0,
  );
  const pourcentage: number = Math.min(
    (totalEconomies / montantACumuler) * 100,
    100,
  );
  const prochainId: number =
    economies.length > 0 ? Math.max(...economies.map((e) => e.id)) + 1 : 1;

  // Progression de la couleur de la barre de progression de l'objectif.

  const couleurBarre = (pct: number): string => {
    if (pct <= 50) {
      // Rouge → Jaune (0% à 50%)
      const r = 220;
      const g = Math.round(0 + (220 - 0) * (pct / 50)); // 0 → 220
      return `rgb(${r}, ${g}, 0)`;
    } else {
      // Jaune → Vert (50% à 100%)
      const r = Math.round(220 + (0 - 220) * ((pct - 50) / 50));
      const g = 220; // 220 → 0
      return `rgb(${r}, ${g}, 0)`;
    }
  };

  //  Formatage
  const formatPrix = (montant: number): string =>
    montant.toFixed(2).replace(".", ",") + "$";

  const formatMontantCourt = (montant: number): string => {
    if (montant >= 1000) {
      return (
        Math.floor(montant)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "$"
      );
    }
    return montant.toFixed(2).replace(".", ",") + "$";
  };

  const formatDate = (date: string): string => {
    const [annee, mois, jour] = date.split("-");
    return `${jour}/${mois}/${annee}`;
  };

  // IMAGE BANNIÈRE
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // POPUP INVITATION
  const handleEnvoyerInvitation = (): void => {
    if (email.trim()) {
      console.log("Invitation envoyée à :", email);
      setEmailEnvoye(true);
      setTimeout(() => {
        setEmailEnvoye(false);
        setEmail("");
        setPopupOuvert(null);
      }, 2000);
    }
  };

  const fermerInvitation = (): void => {
    setEmail("");
    setEmailEnvoye(false);
    setPopupOuvert(null);
  };

  // POPUP AJOUTER UNE ÉCONOMIE
  const ouvrirAjouter = (): void => {
    setNouveauMontant("");
    setNouvelleDate(new Date().toISOString().split("T")[0]);
    setPopupOuvert("ajouter");
  };

  const handleAjouterEconomie = (): void => {
    const montantNum = parseFloat(nouveauMontant.replace(",", "."));
    if (isNaN(montantNum) || montantNum <= 0 || !nouvelleDate) return;

    const nouvelleEconomie: Economie = {
      id: prochainId,
      montant: montantNum,
      date: nouvelleDate,
    };

    setEconomies((prev) => [nouvelleEconomie, ...prev]);
    setPopupOuvert(null);
  };

  // MODE SUPPRIMER (même pattern qu'Enveloppe)
  const activerModeSupprimer = (): void => {
    setModeSupprimer(true);
    setSelectionnes([]);
  };

  const annulerSupprimer = (): void => {
    setModeSupprimer(false);
    setSelectionnes([]);
  };

  const toggleSelection = (index: number): void => {
    setSelectionnes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const confirmerSuppression = (): void => {
    setEconomies((prev) => prev.filter((_, i) => !selectionnes.includes(i)));
    setModeSupprimer(false);
    setSelectionnes([]);
  };

  // POPUP ÉDITION
  const ouvrirEdition = (): void => {
    setEditTitre(titre);
    setEditMontant(String(montantACumuler));
    setEditImageUrl(imageUrl);
    setPopupOuvert("edition");
  };

  const handleEditImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setEditImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSauvegarderEdition = (): void => {
    const montantNum = parseFloat(
      editMontant.replace(",", ".").replace(" ", ""),
    );
    if (!editTitre.trim() || isNaN(montantNum) || montantNum <= 0) return;

    setTitre(editTitre.trim());
    setMontantACumuler(montantNum);
    setImageUrl(editImageUrl);
    setPopupOuvert(null);
  };

  return (
    <div className="objectif_container">
      {/* Bannière image */}
      <div
        className="objectif_banniere"
        onClick={() => inputImageRef.current?.click()}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Couverture"
            className="objectif_banniere_img"
          />
        ) : (
          <div className="objectif_banniere_placeholder">
            <span>Cliquez pour ajouter une image</span>
          </div>
        )}
        <input
          ref={inputImageRef}
          type="file"
          accept="image/*"
          className="objectif_input_image"
          onChange={handleImageChange}
        />
        <button
          className="btn_invite"
          onClick={(e) => {
            e.stopPropagation();
            setPopupOuvert("invitation");
          }}
        >
          Invité +
        </button>
      </div>

      {/* Bouton édition flottant */}
      <button className="btn_edit" onClick={ouvrirEdition}>
        <img className="img_edit" src={imgEdit} />
      </button>

      {/* Corps */}
      <div className="objectif_corps">
        {/* En-tête */}
        <div className="objectif_header">
          <h1 className="objectif_titre">{titre}</h1>
          <div className="objectif_montant_bloc">
            <span className="objectif_montant_label">
              Montant a accumuler :
            </span>
            <span className="objectif_montant_valeur">
              {formatMontantCourt(montantACumuler)}
            </span>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="objectif_barre_fond">
          <div
            className="objectif_barre_remplie"
            style={{
              width: `${pourcentage}%`,
              backgroundColor: couleurBarre(pourcentage),
            }}
          />
          <span className="objectif_barre_pourcentage">
            {Math.round(pourcentage)}%
          </span>
        </div>

        {/* Section économies */}
        <div className="objectif_economies">
          <div className="objectif_economies_header">
            <div className="objectif_economies_gauche">
              <span className="objectif_economies_label">Economie :</span>
              <span className="objectif_economies_total">
                {formatMontantCourt(totalEconomies)}
              </span>
            </div>

            <div className="objectif_economies_actions">
              {!modeSupprimer ? (
                <>
                  <button className="btn_ajouter" onClick={ouvrirAjouter}>
                    Ajouter +
                  </button>
                  <div className="separateur_vertical" />
                  <button
                    className="btn_supprimer"
                    onClick={activerModeSupprimer}
                  >
                    Supprimer
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn_ajouter"
                    onClick={confirmerSuppression}
                  >
                    Confirmer ({selectionnes.length})
                  </button>
                  <button className="btn_supprimer" onClick={annulerSupprimer}>
                    Annuler
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tableau */}
          <table className="objectif_table">
            <thead>
              <tr>
                {modeSupprimer && <th className="col_checkbox"></th>}
                <th>Montant</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {economies.map((eco: Economie, index: number) => (
                <tr
                  key={eco.id}
                  className={
                    selectionnes.includes(index) ? "ligne_selectionnee" : ""
                  }
                  onClick={() => modeSupprimer && toggleSelection(index)}
                >
                  {modeSupprimer && (
                    <td className="col_checkbox">
                      <input
                        type="checkbox"
                        checked={selectionnes.includes(index)}
                        onChange={() => toggleSelection(index)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  <td>{formatPrix(eco.montant)}</td>
                  <td>{formatDate(eco.date)}</td>
                </tr>
              ))}
              {Array.from({ length: Math.max(0, 5 - economies.length) }).map(
                (_, i: number) => (
                  <tr key={`vide-${i}`} className="ligne_vide">
                    {modeSupprimer && <td></td>}
                    <td></td>
                    <td></td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP INVITATION  */}
      {popupOuvert === "invitation" && (
        <div className="popup_overlay" onClick={fermerInvitation}>
          <div className="popup_contenu" onClick={(e) => e.stopPropagation()}>
            <h3 className="popup_titre">Inviter un ami</h3>
            <p className="popup_description">
              Entrez l'adresse email de la personne à inviter.
            </p>
            <input
              type="email"
              className="popup_input"
              placeholder="adresse@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEnvoyerInvitation()}
              autoFocus
            />
            {emailEnvoye ? (
              <div className="popup_succes">✓ Invitation envoyée !</div>
            ) : (
              <div className="popup_boutons">
                <button
                  className="popup_btn_annuler"
                  onClick={fermerInvitation}
                >
                  Annuler
                </button>
                <button
                  className="popup_btn_envoyer"
                  onClick={handleEnvoyerInvitation}
                >
                  Envoyer
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/*  POPUP AJOUTER  */}
      {popupOuvert === "ajouter" && (
        <div className="popup_overlay" onClick={() => setPopupOuvert(null)}>
          <div className="popup_contenu" onClick={(e) => e.stopPropagation()}>
            <h3 className="popup_titre">Ajouter une économie</h3>
            <p className="popup_description">
              Entrez le montant et la date de votre économie.
            </p>

            <label className="popup_label">Montant ($)</label>
            <input
              type="number"
              className="popup_input"
              placeholder="ex: 50.00"
              min="0"
              step="0.01"
              value={nouveauMontant}
              onChange={(e) => setNouveauMontant(e.target.value)}
              autoFocus
            />

            <label className="popup_label">Date</label>
            <input
              type="date"
              className="popup_input"
              value={nouvelleDate}
              onChange={(e) => setNouvelleDate(e.target.value)}
            />

            <div className="popup_boutons">
              <button
                className="popup_btn_annuler"
                onClick={() => setPopupOuvert(null)}
              >
                Annuler
              </button>
              <button
                className="popup_btn_envoyer"
                onClick={handleAjouterEconomie}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/*  POPUP ÉDITION  */}
      {popupOuvert === "edition" && (
        <div className="popup_overlay" onClick={() => setPopupOuvert(null)}>
          <div className="popup_contenu" onClick={(e) => e.stopPropagation()}>
            <h3 className="popup_titre">Modifier l'objectif</h3>

            <label className="popup_label">Titre</label>
            <input
              type="text"
              className="popup_input"
              placeholder="Titre de l'objectif"
              value={editTitre}
              onChange={(e) => setEditTitre(e.target.value)}
              autoFocus
            />

            <label className="popup_label">Montant à accumuler ($)</label>
            <input
              type="number"
              className="popup_input"
              placeholder="ex: 11150"
              min="0"
              step="1"
              value={editMontant}
              onChange={(e) => setEditMontant(e.target.value)}
            />

            <label className="popup_label">Image de couverture</label>
            <div
              className="popup_image_preview"
              onClick={() => editImageRef.current?.click()}
            >
              {editImageUrl ? (
                <img
                  src={editImageUrl}
                  alt="Aperçu"
                  className="popup_image_preview_img"
                />
              ) : (
                <span className="popup_image_placeholder">
                  Cliquez pour choisir une image
                </span>
              )}
            </div>
            <input
              ref={editImageRef}
              type="file"
              accept="image/*"
              className="objectif_input_image"
              onChange={handleEditImageChange}
            />

            <div className="popup_boutons">
              <button
                className="popup_btn_annuler"
                onClick={() => setPopupOuvert(null)}
              >
                Annuler
              </button>
              <button
                className="popup_btn_envoyer"
                onClick={handleSauvegarderEdition}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Objectif;
