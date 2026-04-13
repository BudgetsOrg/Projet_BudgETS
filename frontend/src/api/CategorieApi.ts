import { getToken } from "../../public/token";
import type { Categorie } from "../interfaces";
const API_URL_GLOBAL = "https://projetbudgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";
const debug = false;
const local = false;

// getCategorie, getOneCategorie, postCategorie, deleteCategorie, updateCategorie

export async function getCategorie() {
  const token = getToken() ?? "";

  if (debug) {
    const mockCategorie1 = {
      id_categorie: 1,
      nom_categorie: "Mock Categorie 1",
      recurence: 1,
      depenses: [],
      id_user: 1,
    };
    const mockCategorie2 = {
      id_categorie: 2,
      nom_categorie: "Mock Categorie 2",
      recurence: 5,
      depenses: [],
      id_user: 1,
    };

    return [mockCategorie1, mockCategorie2];
  } else {
    if (local) {
      const response = await fetch(`${API_URL_LOCAL}/categorie/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    } else {
      const response = await fetch(`${API_URL_GLOBAL}/categorie/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    }
  }
}

export async function getOneCategorie(id_categorie: number) {
  const token = getToken() ?? "";

  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/categorie/${id_categorie}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } else {
    const response = await fetch(
      `${API_URL_GLOBAL}/categorie/${id_categorie}`,
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

export async function postCategorie(categorie: Categorie) {
  const token = getToken() ?? "";

  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/categorie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categorie),
    });
    return response.json();
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/categorie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categorie),
    });
    return response.json();
  }
}

export async function deleteCategorie(id_categorie: number) {
  const token = getToken() ?? "";

  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/categorie/${id_categorie}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } else {
    const response = await fetch(
      `${API_URL_GLOBAL}/categorie/${id_categorie}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.json();
  }
}

export async function updateCategorie(
  id_categorie: number,
  categorie: Partial<Categorie>,
) {
  const token = getToken() ?? "";

  if (local) {
    const response = await fetch(
      `${API_URL_LOCAL}/categorie/${id_categorie}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categorie),
      },
    );
    return response.json();
  } else {
    const response = await fetch(
      `${API_URL_GLOBAL}/categorie/${id_categorie}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categorie),
      },
    );
    return response.json();
  }
}
