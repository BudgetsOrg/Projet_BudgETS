import type { Enveloppe } from "../interfaces/interfaces";

const API_URL = "http://localhost:3000";
const debug = true;

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
    const response = await fetch(`${API_URL}/enveloppe`);
    if (!response.ok) {
      throw new Error("Erreur lors du fetch");
    }
    return response.json();
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
    const response = await fetch(`${API_URL}/budget`);
    if (!response.ok) {
      throw new Error("Erreur lors du fetch");
    }
    return response.json();
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
