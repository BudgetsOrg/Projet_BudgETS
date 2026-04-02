// mes fonctions pour aller chercher les données à l'API
// par contre, nous sommes en debug pour l'instant donc debug = true et nous avons des données préparées.

const API_URL_GLOBAL = "https://projetbudgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTc3NTE1MjI1MywiZXhwIjoxNzc1MjM4NjUzfQ.YzE3xvT7r97x26eUGf-vVMVKKshvVTEMTy1JBj9odcY";
//localStorage.getItem("token");
const debug = false;
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

export async function getBudget() {
  if (debug) {
    const mockBudget1 = {
      id_budget: 1,
      solde: 5000,
      date_creation: new Date("2026-04-01"),
      user_id: 1,
    };
    const mockBudget2 = {
      id_budget: 2,
      solde: 2000,
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
      return response.json();
    }
  }
}

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
  } else {
    const response = await fetch(`${API_URL}/objectif`);
    if (!response.ok) {
      throw new Error("Erreur lors du fetch");
    }
    return response.json();
  }
}

export async function getDepenses() {
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
    const response = await fetch(`${API_URL}/depense`);
    if (!response.ok) {
      throw new Error("Erreur lors du fetch");
    }
    return response.json();
  }
}
