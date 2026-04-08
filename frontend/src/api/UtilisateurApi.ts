// mes fonctions pour aller chercher les données à l'API
// par contre, nous sommes en debug pour l'instant donc debug = true et nous avons des données préparées.

import type { Utilisateur } from "../interfaces/interfaces"
let loggedInUser: Utilisateur | null = null;
const API_URL_GLOBAL = "https://projetbudgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";
const token = localStorage.getItem("token");
const debug = false;
// choose one
const local = false;
//A modifier pour get un user.
export async function getUtilisateur() {
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

export async function postUtilisateur(nouvelleUtilisateur: Utilisateur): Promise<Response> {

    const url = local 
        ? `${API_URL_LOCAL}/auth/inscription`
        : `${API_URL_GLOBAL}/auth/inscription`;

    const reponse = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nouvelleUtilisateur),
    });

    return reponse;
}

export async function postConnexion(adresse_email :string,password : string ): Promise<Response> {

    const url = local 
        ? `${API_URL_LOCAL}/auth/connexion`
        : `${API_URL_GLOBAL}/auth/connexion`;

    const reponse = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({adresse_email,password}),
    });

    return reponse;
}

export async function login(adresse_email: string, password: string) {
  if (debug) {
    const mockUser: Utilisateur = {
      id_user: 1,
      nom: "Doe",
      prenom: "John",
      adresse_email: "john.doe@example.com",
      telephone: "1234567890",
      image: "https://thispersondoesnotexist.com/",
      date_naissance: "1990-01-01",
      password :"123",
      soldeDumois: 50
    };
    loggedInUser = mockUser;
    return mockUser;
  } else if(local) {
    const response = await fetch(`${API_URL_GLOBAL}/connexion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adresse_email, password }),
    });
    if (!response.ok) {
      throw new Error("Erreur lors du login");
    }
    const user = await response.json();
    loggedInUser = user;
    return user;
  }
}
//TODO : Change with the actual login information, used as a placeholder for the profile page;
export function getLoggedInUser() {
  if (debug) {
    login("john.doe", "password"); // This will set the loggedInUser variable to the mock user, which is fine for now as we are just testing the profile page with a mock user. We should handle this more gracefully in a real application.
  }
  if (!loggedInUser) {
    //We should probably send the user back to the login page instead of throwing an error
    throw new Error("No user is currently logged in");
  }
  return loggedInUser;
}
