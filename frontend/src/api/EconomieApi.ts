import { getToken } from "../../public/token";
import type { Economie } from "../interfaces";
const API_URL_GLOBAL = "https://budgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";

const debug = false;
// choose one
const local = false;

// getEconomie, getOneEconomie, postEconomie, deleteEconomie, updateEconomie


// Cette fonction permet de récuperer toutes les économies d'un objectif pour pouvoir prendre les bonnes économies
// on passe en paramètre le id de l'objectif qu'on veux récuperer les Économies.
export async function getEconomie(id_objectif: number) {
  const token = getToken() ?? "";

  if (debug) {
    const mockEconomie1 = {
      id: 1,
      titre: "Mock Economie 1",
      montant: 100,
      date: "2026-03-29",
    };
    const mockEconomie2 = {
      id: 2,
      titre: "Mock Economie 2",
      montant: 200,
      date: "2026-03-26",
    };
    return [mockEconomie1, mockEconomie2];
  } else {
    if (local) {
      const response = await fetch(
        `${API_URL_LOCAL}/economie/objectif/${id_objectif}`,
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
        `${API_URL_GLOBAL}/economie/objectif/${id_objectif}`,
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

// Cette fonction permet de recuperer une seul économie.Cette fonction permet de 
// selectionner une économie en particulier en passant par son id qui est passé en paramètre.
export async function getOneEconomie(id_economie: number) {
  const token = getToken() ?? "";

  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/economie/${id_economie}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/economie/${id_economie}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }
}

// Cette fonction permet d'ajoute une économie elle sera ajouté à un objectif.
export async function postEconomie(economie: Economie) {
  const token = getToken() ?? "";

  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/economie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(economie),
    });
    return response.json();
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/economie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(economie),
    });
    return response.json();
  }
}


//Cette fonction permet de retirer une seul économie.Afin de selectionner la bonne économie on passe le id en paramètre.
export async function deleteEconomie(id_economie: number) {
  const token = getToken() ?? "";

  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/economie/${id_economie}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/economie/${id_economie}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }
}


//Cette fonction permet de modifier la ou les informations d'une Économie.
export async function updateEconomie(economie: Economie) {
  const token = getToken() ?? "";

  if (local) {
    const response = await fetch(
      `${API_URL_LOCAL}/economie/${economie.id_economie}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(economie),
      },
    );
    return response.json();
  } else {
    const response = await fetch(
      `${API_URL_GLOBAL}/economie/${economie.id_economie}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(economie),
      },
    );
    return response.json();
  }
}
