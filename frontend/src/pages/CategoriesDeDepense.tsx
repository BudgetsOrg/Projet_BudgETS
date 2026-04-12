import { useEffect, useState } from "react";
import { getCategorie } from "../api/CategorieApi";
import type { Categorie } from "../interfaces";

export default function CategoriesDeDepense() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = (await getCategorie()) as Categorie[];
        setCategories(data);
      } catch (error: any) {
        setError("Erreur lors du chargement des catégories.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return <div>Chargement des catégories...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="flex flex-col items-start p-8 gap-4">
        <h1 className="text-3xl font-bold mb-4 p-4">Catégories de dépense</h1>
        <button className="confirm-button rounded-lg w-40 h-10 mb-4">
          Ajouter
        </button>
      </div>
      <div className="flex flex-row p-8 gap-8">
        <div className="w-1/2">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((categorie) => (
                <tr key={categorie.id_categorie}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {categorie.nom_categorie}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <button className="confirm-button rounded-lg p-2">
                        Modifier
                      </button>
                      <button className="delete-button rounded-lg p-2">
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
            <ul>
              <li className="p-2 flex mr-4" key={categorie.id_categorie}>
                <span className="mr-30 text-white">
                  {categorie.nom_categorie}
                </span>
                <span className="text-white">{categorie.recurence}</span>
              </li>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}
