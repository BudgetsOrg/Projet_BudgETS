// mes fonctions pour aller chercher les données à l'API
// par contre, nous sommes en debug pour l'instant donc debug = true et nous avons des données préparées.

import { getToken } from "../../public/token";

const API_URL_GLOBAL = "https://projetbudgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";
const token = getToken() ?? ""
//localStorage.getItem("token");
const debug = true;
// choose one
const local = false;

export async function getObjectif() {
  if (debug) {
    const mockObjectif1 = {
      id_objectif: 1,
      titre: "Mock Objectif 2",
      montant: 1000,
      image: "https://picsum.photos/1000/100",
      date_limite: new Date("2026-12-31"),
      user_id: 1,
    };
    const mockObjectif2 = {
      id_objectif: 2,
      titre: "Mock Objectif 3",
      montant: 2000,
      image: "https://picsum.photos/1000/100",
      date_limite: new Date("2026-12-31"),
      user_id: 1,
    };
    return [mockObjectif1, mockObjectif2];
  }
  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/enveloppe`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/enveloppe`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }
}
