import { useEffect, useState } from "react";
import { deleteCategorie, getCategorie } from "../api/CategorieApi";
import type { Categorie } from "../interfaces";
import NouvelleCategorie from "../popups/AjoutPopup/NouvelleCategorie";
import ModifierCategorie from "../popups/ModifierCategorie";

export default function CategoriesDeDepense() {
  // state pour categories
  const [categories, setCategories] = useState<Categorie[]>([]);
  // state pour le loading
  const [isLoading, setIsLoading] = useState(true);
  // state pour l'erreur
  const [error, setError] = useState<string | null>(null);
  // state pour le pop up d'ajouter une enveloppe
  const [showAjoutPopup, setShowAjoutPopup] = useState(false);
  // state pour modifier une enveloppe
  const [showModifierPopup, setShowModifierPopup] = useState(false);
  // state catégorie sélectionner pour modification
  const [selectedCategorie, setSelectedCategorie] = useState<Categorie | null>(
    null,
  );
  // state pour le refresh
  const [refreshKey, setRefreshKey] = useState(0);
  // quand une catégorie change, changer valeur de la clé, inciter changement du reste
  const onCategoriesChanged = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // load les catégories et gère le load initial et ceux causés par chan
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getCategorie();
        setCategories(categories);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur de chargement des catégories :", error);
        setError("Erreur de chargement des catégories");
        setIsLoading(false);
      }
    };

    // quand la valeur de la clé change, il faut appeler loadCategories().
    loadCategories();
  }, [refreshKey]);

  // appeler pour suppression et change state pour refresh
  const handleSupprimer = async (id_categorie: number) => {
    await deleteCategorie(id_categorie);
    onCategoriesChanged();
  };

  if (isLoading) {
    return <div>Chargement des catégories...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="flex flex-col items-start p-8 gap-4">
        <h1 className="text-3xl font-bold mb-4">Catégories de dépense</h1>
        <button
          className="confirm-button rounded-lg w-40 h-10 mb-4"
          onClick={() => setShowAjoutPopup(true)}
        >
          Ajouter
        </button>
      </div>
      <div className="flex flex-row p-8 gap-8">
        <div className="w-1/2">
          <table className="min-w-full divide-y divide-gray-200 border-2">
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((categorie) => (
                <tr key={categorie.id_categorie}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {categorie.nom_categorie}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-4">
                      <button
                        className="confirm-button rounded-lg p-2"
                        onClick={() => {
                          // lui dire quelle catégorie veut être modifiée
                          setSelectedCategorie(categorie);
                          setShowModifierPopup(true);
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        className="delete-button rounded-lg p-2"
                        onClick={() => handleSupprimer(categorie.id_categorie)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-[var(--color-primary)] w-1/2 p-4 rounded-lg">
          <h2 className="font-bold text-[var(--color-secondary)] text-2xl">
            Recurrence
          </h2>
          {categories.map((categorie) => (
            <table
              className="min-w-full divide-y divide-gray-400 "
              key={categorie.id_categorie}
            >
              <tbody className="divide-y divide-gray-400">
                <tr>
                  <td className="text-white px-6 py-4 whitespace-nowrap">
                    {categorie.nom_categorie}
                  </td>
                  <td className="text-white px-6 py-4">
                    {categorie.recurence}
                  </td>
                </tr>
              </tbody>
            </table>
          ))}
        </div>
        <ModifierCategorie
          showPopup={showModifierPopup}
          closePopup={() => {
            setShowModifierPopup(false);
            setSelectedCategorie(null);
          }}
          categorie={selectedCategorie}
          // quand on save, dit qu'il y a changement
          onSaved={async () => {
            onCategoriesChanged();
          }}
        />

        <NouvelleCategorie
          showPopup={showAjoutPopup}
          closePopup={() => setShowAjoutPopup(false)}
          // quand on save, dit qu'il y a changement
          onSaved={async () => {
            onCategoriesChanged();
          }}
        />
      </div>
    </div>
  );
}
