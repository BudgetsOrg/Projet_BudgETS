import { getToken } from "../../public/token";
import type { Depense } from "../interfaces";
const API_URL_GLOBAL = "https://budgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";
const debug = false;
const local = false;

// getDepenses, getOneDepense, postDepense, deleteDepense, updateDepense


//Cette fonction permet de récuperer toutes les Dépenses qui sont relié à une seul Enveloppe.
// Afin de choisir la bonne Enveloppe on passe en paramètre le id de l'Enveloppe.
export async function getDepenses(id_enveloppe: number) {
  const token = getToken() ?? "";

  if (debug) {
    const mockDepense1 = {
      id_depense: 1,
      nom_depense: "Mock Depense 1",
      montant: 10, // ← montant au lieu de prix
      date: "2026-03-29",
      id_enveloppe: id_enveloppe,
      id_categorie: 1,
    };
    const mockDepense2 = {
      id_depense: 2,
      nom_depense: "Mock Depense 2",
      montant: 20, // ← montant au lieu de prix
      date: "2026-03-26",
      id_enveloppe: id_enveloppe,
      id_categorie: 1,
    };
    const mockDepense3 = {
      id_depense: 3,
      nom_depense: "Mock Depense 3",
      montant: 20, // ← montant au lieu de prix
      date: "2026-03-26",
      id_enveloppe: id_enveloppe,
      id_categorie: 1,
    };
    return [mockDepense1, mockDepense2, mockDepense3];
  } else {
    if (local) {
      const response = await fetch(
        `${API_URL_LOCAL}/depense/enveloppe/${id_enveloppe}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.json();
    } else {
      const response = await fetch(
        `${API_URL_GLOBAL}/depense/enveloppe/${id_enveloppe}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.json();
    }
  }
}


//Cette fonction permet de get une seul dépense pour prendre
//la bonne dépense on passe en paramètre l'id de la dépense qu'on veux récuperer.
export async function getOneDepense(id_depense: number) {
  const token = getToken() ?? "";

  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/depense/${id_depense}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/depense/${id_depense}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }
}


//Cette fonction permet d'ajouter une dépense qui sera relié à un objectif et relié à un Utilisateur.
export async function postDepense(depense: Depense) {
  const token = getToken() ?? "";

  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/depense`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(depense),
    });
    return response.json();
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/depense`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(depense),
    });
    return response.json();
  }
}

//Cette fonction permet de supprimer une dépense et non toutes les dépenses
//d'une Enveloppe pour pouvoir sélectionner cette dépense qu'on veux supprimer on va
//passer en paramètre le id de la dépense qu'on veux supprimer.
export async function deleteDepense(id_depense: number) {
  const token = getToken() ?? "";

  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/depense/${id_depense}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/depense/${id_depense}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }
}


//Cette méthode permet de changer certaine(s) informations d'une dépense.
export async function updateDepense(depense: Depense) {
  const token = getToken() ?? "";

  if (local) {
    const response = await fetch(
      `${API_URL_LOCAL}/depense/${depense.id_depense}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...depense,
          date: depense.date?.split("T")[0],
        }),
      },
    );
    return response.json();
  } else {
    const response = await fetch(
      `${API_URL_GLOBAL}/depense/${depense.id_depense}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(depense),
      },
    );
    return response.json();
  }
}
