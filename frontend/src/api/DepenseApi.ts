import type { Depense } from "../interfaces";
const API_URL_GLOBAL = "https://projetbudgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTc3NTE1MjI1MywiZXhwIjoxNzc1MjM4NjUzfQ.YzE3xvT7r97x26eUGf-vVMVKKshvVTEMTy1JBj9odcY";
//localStorage.getItem("token");
const debug = false;
// choose one
const local = false;

export async function getDepenses(id_enveloppe: number) {
  if (debug) {
    const mockDepense1 = {
      id: 1,
      titre: "Mock Depense 1",
      categorie: "Alimentation",
      prix: 10,
      date: "2026-03-29",
    };
    const mockDepense2 = {
      id: 2,
      titre: "Mock Depense 2",
      categorie: "Alimentation",
      prix: 20,
      date: "2026-03-26",
    };
    const mockDepense3 = {
      id: 2,
      titre: "Mock Depense 3",
      categorie: "Alimentation",
      prix: 20,
      date: "2026-03-26",
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

export async function getOneDepense(id_depense: number) {
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

export async function postDepense(depense: Depense) {
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

export async function deleteDepense(id_depense: number) {
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

export async function updateDepense(depense: Depense) {
  if (local) {
    const response = await fetch(
      `${API_URL_LOCAL}/depense/${depense.id_depense}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ depense }),
      },
    );
    return response.json();
  } else {
    const response = await fetch(
      `${API_URL_GLOBAL}/depense/${depense.id_depense}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ depense }),
      },
    );
    return response.json();
  }
}
