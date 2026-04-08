import type { Enveloppe } from "../interfaces";
const API_URL_GLOBAL = "https://projetbudgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTc3NTE1MjI1MywiZXhwIjoxNzc1MjM4NjUzfQ.YzE3xvT7r97x26eUGf-vVMVKKshvVTEMTy1JBj9odcY";
//localStorage.getItem("token");
const debug = true;
// choose one
const local = false;

export async function getEnveloppe() {
  if (debug) {
    const mockEnveloppe1 = {
      id_enveloppe: 1,
      titre: "Mock Enveloppe 2",
      montant: 1000,
      image: "https://picsum.photos/200/300",
    };
    const mockEnveloppe2 = {
      id_enveloppe: 2,
      titre: "Mock Enveloppe 3",
      montant: 2000,
      image: "https://picsum.photos/200/302",
    };
    return [mockEnveloppe1, mockEnveloppe2];
  } else {
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
}

export async function getEnveloppeById(id_enveloppe: number) {
  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/enveloppe/${id_enveloppe}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } else {
    const response = await fetch(
      `${API_URL_GLOBAL}/enveloppe/${id_enveloppe}`,
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

export async function postEnveloppe(enveloppe: Enveloppe) {
  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/enveloppe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ enveloppe }),
    });
    return response.json();
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/enveloppe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ enveloppe }),
    });
    return response.json();
  }
}

export async function deleteEnveloppe(id_enveloppe: number) {
  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/enveloppe/${id_enveloppe}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } else {
    const response = await fetch(
      `${API_URL_GLOBAL}/enveloppe/${id_enveloppe}`,
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

export async function updateEnveloppe(enveloppe: Enveloppe) {
  if (local) {
    const response = await fetch(
      `${API_URL_LOCAL}/enveloppe/${enveloppe.id_enveloppe}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enveloppe }),
      },
    );
    return response.json();
  } else {
    const response = await fetch(
      `${API_URL_GLOBAL}/enveloppe/${enveloppe.id_enveloppe}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enveloppe }),
      },
    );
    return response.json();
  }
}
