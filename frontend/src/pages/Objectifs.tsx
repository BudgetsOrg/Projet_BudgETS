// Composant Objectif
// Affiche le détail d'un objectif d'épargne avec image de couverture et invitation par email
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import imgEdit from "../img/edit.png";
import { updateObjectif, getObjectif, inviteUtilisateurObjectif } from "../api/ObjectifApi";
import { postEconomie, updateEconomie, deleteEconomie, getEconomie } from "../api/EconomieApi";
import { BackgroundColor } from "devextreme-react/cjs/chart";
import GraphiqueObjectif from "../components/graphiques/graphiqueObjectif";
import { useCloudinaryImage } from "../hooks/useCloudinaryImage";

interface Economie {
  id: number;
  montant: number;
  date: string;
}


type TypePopup = "invitation" | "ajouter" | "edition" | "editionEconomie" | null;

function Objectif() {
  const location = useLocation();
  const idObjectif = location.state?.id_objectif;
  // État principal
  const [titre, setTitre] = useState<string>(location.state?.titre ?? "");
  const [montantACumuler, setMontantACumuler] = useState<number>(Number(location.state?.montantAccumule) || 0);
  const [imageUrl, setImageUrl] = useState<string | null>(location.state?.imageUrl ?? null);
  const [economies, setEconomies] = useState<Economie[]>([]);

  //Pop up modifier l'economie.
  const [economieEnEdition, setEconomieEnEdition] = useState<Economie | null>(null);
  const [editEconomieMontant, setEditEconomieMontant] = useState<string>("");
  const [editEconomieDate, setEditEconomieDate] = useState<string>("");

  //  Mode supprimer 
  const [modeSupprimer, setModeSupprimer] = useState<boolean>(false);
  const [selectionnes, setSelectionnes] = useState<number[]>([]);
  // Popups
  const [popupOuvert, setPopupOuvert] = useState<TypePopup>(null);

  //  Popup Invitation
  const [email, setEmail] = useState<string>("");
  const [messageErreur, setMessageErreur] = useState("");
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

  const {
    previewUrl: editImagePreview,
    file: editImageFile,
    uploading: uploadingObjectifImage,
    error: uploadObjectifError,
    onFileChange: onEditImageFileChange,
    upload: uploadObjectifImage,
    reset: resetObjectifImage,
  } = useCloudinaryImage({ initialUrl: imageUrl, folder: "objectifs" });

  //  Calculs
  const totalEconomies: number = economies.reduce(
    (acc, e) => acc + e.montant,
    0,
  );
  const pourcentage: number = Math.min(
    (totalEconomies / montantACumuler) * 100,
    100,
  );
  // Progression de la couleur de la barre de progression de l'objectif.

  const couleurBarre = (pct: number): string => {
    const p = Math.min(Math.max(pct, 0), 100);

    // 0% → 50% (rouge vers jaune)
    if (p <= 50) {
      const ratio = p / 50;

      const r = Math.round(255 + (223 - 255) * ratio);
      const g = Math.round(0 + (197 - 0) * ratio);
      const b = Math.round(0 + (55 - 0) * ratio);

      return `rgb(${r}, ${g}, ${b})`;
    }

    // 50% → 100% (jaune vers vert)
    const ratio = (p - 50) / 50;

    const r = Math.round(223 + (127 - 223) * ratio);
    const g = Math.round(197 + (167 - 197) * ratio);
    const b = Math.round(55 + (90 - 55) * ratio);

    return `rgb(${r}, ${g}, ${b})`;
  };

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // POPUP INVITATION
  const handleEnvoyerInvitation = async (): Promise<void> => {
    if (email.trim()) {
      console.log("Invitation envoyée à () :", email);

      try {
        await inviteUtilisateurObjectif(idObjectif, email);

        setEmailEnvoye(true);
        setMessageErreur("");

        setTimeout(() => {
          setEmailEnvoye(false);
          setEmail("");
          setPopupOuvert(null);
        }, 2000);

      } catch (error: any) {
        console.log("Erreur dans l'ajout d'un utilisateur dans l'objectif : ", error);
        const status = error?.response?.status || error?.status;
        if (status == 404) {
          setMessageErreur("Il n'existe aucun Utilisateur relié à ce mail.")
        } else {
          setMessageErreur("Erreur lors de l'envoi de l'invitation.");
        }

        setEmailEnvoye(false);
      }

    }
  };

  const fermerInvitation = (): void => {
    setEmail("");
    setEmailEnvoye(false);
    setPopupOuvert(null);
  };

  const ouvrirAjouter = (): void => {
    setNouveauMontant("");
    setNouvelleDate(new Date().toISOString().split("T")[0]);
    setPopupOuvert("ajouter");
  };

  const handleAjouterEconomie = async (): Promise<void> => {
    const montantNum = parseFloat(nouveauMontant.replace(",", "."));
    if (isNaN(montantNum) || montantNum <= 0 || !nouvelleDate) return;
    try {
      await postEconomie({
        id_economie: 0,
        montant: montantNum,
        date: nouvelleDate,
        objectifId: idObjectif,
      });
      await recupererEconomies();
    } catch (error: any) {
      console.log
      alert("Erreur lors de l'ajout : " + error.message);
      return;
    }
    setPopupOuvert(null);
  };

  // MODE SUPPRIMER 
  const activerModeSupprimer = (): void => {
    setModeSupprimer(true);
    setSelectionnes([]);
  };

  const annulerSupprimer = (): void => {
    setModeSupprimer(false);
    setSelectionnes([]);
  };

  const toggleSelection = (id: number): void => {
    setSelectionnes((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const confirmerSuppression = async (): Promise<void> => {
    try {
      for (const index of selectionnes) {
        const eco = economies[index];
        if (eco.id) await deleteEconomie(eco.id);
      }
      await recupererEconomies();
    } catch (error: any) {
      alert("Erreur lors de la suppression : " + error.message);
    }
    setModeSupprimer(false);
    setSelectionnes([]);
  };

  // POPUP ÉDITION
  const ouvrirEdition = (): void => {
    setEditTitre(titre);
    setEditMontant(String(montantACumuler));
    setEditImageUrl(imageUrl);
    resetObjectifImage(imageUrl);
    setPopupOuvert("edition");
  };
  useEffect(() => {
    const recupererObjectif = async () => {
      try {
        const data = await getObjectif();
        if (!Array.isArray(data)) return;
        const objectif = data.find((o: any) => o.id_objectif === idObjectif);
        if (objectif) {
          setTitre(objectif.titre);
          setMontantACumuler(Number(objectif.montant) || 0);
          setImageUrl(objectif.image ?? null);
        }
      } catch (error: any) {
        console.error("Erreur chargement objectif :", error);
      }
    };
    if (idObjectif) recupererObjectif();
  }, []);

  const handleSauvegarderEdition = async (): Promise<void> => {
    const montantNum = parseFloat(editMontant.replace(",", ".").replace(" ", ""));
    if (!editTitre.trim() || isNaN(montantNum) || montantNum <= 0) return;

    let nouvelleImageUrl = imageUrl;

    try {
      if (editImageFile) {
        const uploadedUrl = await uploadObjectifImage();
        if (uploadedUrl) {
          nouvelleImageUrl = uploadedUrl;
        }
      }
    } catch (err) {
      console.error("Erreur upload image :", err);
      alert("Erreur lors du téléchargement de l'image.");
      return;
    }

    try {
      await updateObjectif({
        id_objectif: idObjectif,
        titre: editTitre.trim(),
        montant: montantNum,
        image: nouvelleImageUrl ?? "",
      });
      setTitre(editTitre.trim());
      setMontantACumuler(montantNum);
      setImageUrl(nouvelleImageUrl);
    } catch (error: any) {
      console.error("Erreur modification objectif :", error);
      alert("Erreur lors de la modification : " + error.message);
      return;
    }
    setPopupOuvert(null);
  };

  const handleModifierEconomie = async (): Promise<void> => {
    if (!economieEnEdition) return;
    const montantNum = parseFloat(editEconomieMontant.replace(",", "."));
    if (isNaN(montantNum) || montantNum <= 0 || !editEconomieDate) return;

    console.log("Données envoyées :", {
      id_economie: economieEnEdition.id,
      montant: montantNum,
      date: editEconomieDate,
      objectifId: idObjectif,
    });

    try {
      await updateEconomie({
        id_economie: economieEnEdition.id,
        montant: montantNum,
        date: editEconomieDate,
        objectifId: idObjectif,
      });
      await recupererEconomies();
    } catch (error: any) {
      alert("Erreur lors de la modification : " + error.message);
      return;
    }
    setPopupOuvert(null);
    setEconomieEnEdition(null);
  };
  const recupererEconomies = async () => {
    try {
      const data = await getEconomie(idObjectif);
      if (!Array.isArray(data)) return;
      setEconomies(data.map((e: any) => ({
        id: e.id_economie ?? e.id,
        montant: parseFloat(e.montant) || 0,
        date: e.date?.split("T")[0] ?? e.date,
      })));
    } catch (error: any) {
      console.error("Erreur chargement économies :", error);
    }
  };

  useEffect(() => {
    if (idObjectif) recupererEconomies();
  }, []);

  return (
    <div className="objectif_container">
      <div
        className="objectif_banniere"
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
                {!modeSupprimer && <th>Action</th>}
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
                  {!modeSupprimer && (
                    <td>
                      <button
                        className="btn_modifier"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEconomieEnEdition(eco);
                          setEditEconomieMontant(String(eco.montant));
                          setEditEconomieDate(eco.date);
                          setPopupOuvert("editionEconomie");
                        }}
                      >
                        Modifier
                      </button>
                    </td>

                  )}
                </tr>
              ))}

              {Array.from({ length: Math.max(0, 5 - economies.length) }).map(
                (_, i: number) => (
                  <tr key={`vide-${i}`} className="ligne_vide">
                    {modeSupprimer && <td className="col_checkbox"></td>}
                    <td></td>
                    <td></td>
                    {!modeSupprimer && <td></td>}
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

            {emailEnvoye && (
              <div className="popup_succes"> Invitation envoyée !</div>
            )}

            {messageErreur && (
              <div className="popup_erreur">{messageErreur}</div>
            )}

            <div className="popup_boutons">
              <button className="popup_btn_annuler" onClick={fermerInvitation}>
                Annuler
              </button>

              <button className="popup_btn_envoyer" onClick={handleEnvoyerInvitation}>
                Envoyer
              </button>
            </div>

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
              {editImagePreview || editImageUrl ? (
                <img
                  src={editImagePreview || editImageUrl || undefined}
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
              onChange={onEditImageFileChange}
            />

            {uploadObjectifError && (
              <p className="text-red-500 text-sm mt-2">{uploadObjectifError}</p>
            )}

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
                disabled={uploadingObjectifImage}
              >
                {uploadingObjectifImage ? "Sauvegarde..." : "Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}

      {popupOuvert === "editionEconomie" && (
        <div className="popup_overlay" onClick={() => setPopupOuvert(null)}>
          <div className="popup_contenu" onClick={(e) => e.stopPropagation()}>
            <h3 className="popup_titre">Modifier une économie</h3>
            <label className="popup_label">Montant ($)</label>
            <input
              type="number"
              className="popup_input"
              min="0"
              step="0.01"
              value={editEconomieMontant}
              onChange={(e) => setEditEconomieMontant(e.target.value)}
              autoFocus
            />
            <label className="popup_label">Date</label>
            <input
              type="date"
              className="popup_input"
              value={editEconomieDate}
              onChange={(e) => setEditEconomieDate(e.target.value)}
            />
            <div className="popup_boutons">
              <button className="popup_btn_annuler" onClick={() => setPopupOuvert(null)}>Annuler</button>
              <button className="popup_btn_envoyer" onClick={handleModifierEconomie}>Modifier</button>
            </div>
          </div>
        </div>
      )}
      <div className="p-10">
        <GraphiqueObjectif
          economies={economies as any}
          date_limite={montantACumuler}
        />
      </div>
    </div>
  );
}

export default Objectif;
