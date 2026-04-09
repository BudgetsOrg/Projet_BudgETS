import type { NumberBoxTypes } from "devextreme-react/cjs/number-box";
import { getToken } from "../../public/token";
import type { Budget } from "../interfaces";
const API_URL_GLOBAL = "https://projetbudgets-backend.up.railway.app";
const API_URL_LOCAL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const token = getToken() ?? "";
const debug = false;
// choose one
const local = false;

export async function getLastBudget() {
  if (debug) {
    const mockBudget1 = {
      id_budget: 1,
      solde: 5000,
      soldeDuMois: 5000,
      date_creation: new Date("2026-04-01"),
      user_id: 1,
    };
    const mockBudget2 = {
      id_budget: 2,
      solde: 2000,
      soldeDuMois: 2000,
      date_creation: new Date("2026-02-01"),
      user_id: 1,
    };
    return [mockBudget1, mockBudget2];
  } else {
    if (local) {
      const response = await fetch(`${API_URL_LOCAL}/budget/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    } else {
      const response = await fetch(`${API_URL_GLOBAL}/budget/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response from API:", response);
      return response.json();
    }
  }
}

export async function getBudgetById(id_budget: number) {
  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/budget/${id_budget}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/budget/${id_budget}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }
}

export async function getBudgetHistorique() {
  // à faire : ne comprend pas
}

export async function postBudget(budget: Budget) {
  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/budget`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(budget),
    });
    return response.json();
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/budget`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(budget),
    });
    return response.json();
  }
}

export async function deleteBudget(id_budget: number) {
  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/budget/${id_budget}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/budget/${id_budget}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }
}

export async function updateBudget(solde: number, id_budget: number) {
  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/budget/${id_budget}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ soldeDuMois: solde }),
    });
    return response.json();
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/budget/${id_budget}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ soldeDuMois: solde }),
    });
    return response.json();
  }
}
