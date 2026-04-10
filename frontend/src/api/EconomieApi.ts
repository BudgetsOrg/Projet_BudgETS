import { getToken } from "../../public/token";
import type { Economie } from "../interfaces";
const API_URL_GLOBAL = "https://projetbudgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";
//localStorage.getItem("token");
const debug = true;
// choose one
const local = false;

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

export async function updateEconomie(economie: Economie) {
const token = getToken() ?? "";

  if (local) {
    const response = await fetch(
      `${API_URL_LOCAL}/economie/${economie.id_economie}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ economie }),
      },
    );
    return response.json();
  } else {
    const response = await fetch(
      `${API_URL_GLOBAL}/economie/${economie.id_economie}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ economie }),
      },
    );
    return response.json();
  }
}
