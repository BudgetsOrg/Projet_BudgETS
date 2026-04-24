import { getToken } from "../../public/token";
import type { Enveloppe, EnveloppeCreate } from "../interfaces";
const API_URL_GLOBAL = "https://budgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";
const debug = false;
// choose one
const local = false;

// getEnveloppe, getEnveloppeById, postEnveloppe, deleteEnveloppe, updateEnveloppe


// Cette fonction permet de get tous les enveloppes qui
// sont reliée à un Utilisateur pour pouvoir les afficher dans la page principale.
export async function getEnveloppe() {
  const token = getToken() ?? "";

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

// Cette méthode permet de selectionner une seul Enveloppe que l'on voudra afficher une information dessus comme par exemple
//  lorsque on rentre dans la page qui affiche les détails d'une Enveloppe.
export async function getEnveloppeById(id_enveloppe: number) {
  const token = getToken() ?? "";

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

//Cette méthode permet d'ajouter une Enveloppe à l'utilisateur dans la base de données.
export async function postEnveloppe(enveloppe: EnveloppeCreate) {
  const token = getToken() ?? "";

  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/enveloppe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(enveloppe),
    });
    return response.json();
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/enveloppe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(enveloppe),
    });
    return response.json();
  }
}

// Cette méthode permet de retirer une Enveloppe associé à un Utilisateur.
// Afin de choisir la bonne Enveloppe la méthode prend en paramètre le id de l'enveloppe à supprimer.
export async function deleteEnveloppe(id_enveloppe: number) {
  const token = getToken() ?? "";

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

// Cette fonction permet de modifier dans la base de données une Enveloppe.
export async function updateEnveloppe(enveloppe: Enveloppe) {
  const token = getToken() ?? "";

  if (local) {
    const response = await fetch(
      `${API_URL_LOCAL}/enveloppe/${enveloppe.id_enveloppe}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(enveloppe),
      },
    );
    return response.json();
  } else {
    const response = await fetch(
      `${API_URL_GLOBAL}/enveloppe/${enveloppe.id_enveloppe}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(enveloppe),
      },
    );
    return response.json();
  }
}
