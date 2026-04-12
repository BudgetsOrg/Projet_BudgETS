// mes fonctions pour aller chercher les données à l'API
// par contre, nous sommes en debug pour l'instant donc debug = true et nous avons des données préparées.

import { getToken } from "../../public/token";
import type { Objectif } from "../interfaces";

const API_URL_GLOBAL = "https://projetbudgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";
//localStorage.getItem("token");
const debug = false;
// choose one
const local = false;

export async function getObjectif() {
  const token = getToken() ?? "";

  if (debug) {
    const mockObjectif1: Objectif = {
      id_objectif: 1,
      titre: "Mock Objectif 2",
      montant: 1000,
      image: "https://picsum.photos/1000/100",
      date_limite: "2026-12-31",
      user_id: 1,
    };
    const mockObjectif2: Objectif = {
      id_objectif: 2,
      titre: "Mock Objectif 3",
      montant: 2000,
      image: "https://picsum.photos/1000/100",
      date_limite: "2026-12-31",
      user_id: 1,
    };
    return [mockObjectif1, mockObjectif2];
  }

  const baseUrl = local ? API_URL_LOCAL : API_URL_GLOBAL;
  const response = await fetch(`${baseUrl}/objectif`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function updateObjectif(objectif: Objectif) {
  const token = getToken() ?? "";

  const baseUrl = local ? API_URL_LOCAL : API_URL_GLOBAL;

  const response = await fetch(`${baseUrl}/objectif/${objectif.id_objectif}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(objectif),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erreur mise a jour objectif (${response.status}): ${errorText}`,
    );
  }

  return response.json();
}

export async function deleteObjectif(id_objectif: number) {
  const token = getToken() ?? "";

  const baseUrl = local ? API_URL_LOCAL : API_URL_GLOBAL;

  const response = await fetch(`${baseUrl}/objectif/${id_objectif}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erreur suppression objectif (${response.status}): ${errorText}`,
    );
  }

  return response.json();
}

export async function postObjectif(objectif: Objectif) {
  const token = getToken() ?? "";

  const baseUrl = local ? API_URL_LOCAL : API_URL_GLOBAL;

  const response = await fetch(`${baseUrl}/objectif`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(objectif),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erreur création objectif (${response.status}): ${errorText}`,
    );
  }

  return response.json();
}
