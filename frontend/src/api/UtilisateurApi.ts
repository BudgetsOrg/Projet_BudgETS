// mes fonctions pour aller chercher les données à l'API
// par contre, nous sommes en debug pour l'instant donc debug = true et nous avons des données préparées.

import { getToken } from "../../public/token";
import type { Utilisateur } from "../interfaces";
let loggedInUser: Utilisateur | null = null;
const API_URL_GLOBAL = "https://projetbudgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";
const debug = false;
const local = false;
//A modifier pour get un user.
export async function getUtilisateur() {
  const token = getToken() ?? "";

  if (debug) {
    const mockUser: Utilisateur = {
      id_user: 1,
      nom: "Doe",
      prenom: "John",
      adresse_email: "john.doe@example.com",
      telephone: "1234567890",
      image: "https://thispersondoesnotexist.com/",
      date_naissance: "1990-01-01",
      password: "123",
      soldeDumois: 50,
    };
    return mockUser;
  } else {
    if (local) {
      const response = await fetch(`${API_URL_LOCAL}/users/me`, {
        method: "GET",
        // retiré cashe no store :
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    } else {
      const response = await fetch(`${API_URL_GLOBAL}/users/me`, {
        method: "GET",
        // retiré cashe no store :
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    }
  }
}

export async function postUtilisateur(
  nouvelleUtilisateur: Utilisateur,
): Promise<Response> {
  const token = getToken() ?? "";

  const url = local
    ? `${API_URL_LOCAL}/auth/inscription`
    : `${API_URL_GLOBAL}/auth/inscription`;

  const reponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nouvelleUtilisateur),
  });

  return reponse;
}

export async function updateUtilisateur(
  nom: string,
  prenom: string,
  telephone: string,
  date_naissance: string,
) {
  const token = getToken() ?? "";

  const url = local
    ? `${API_URL_LOCAL}/users/me`
    : `${API_URL_GLOBAL}/users/me`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nom, prenom, date_naissance, telephone }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erreur mise a jour profil (${response.status}): ${errorText}`,
    );
  }

  return response.json();
}

export async function updateUtilisateurImage(image: string) {
  const token = getToken() ?? "";

  const url = local
    ? `${API_URL_LOCAL}/users/me`
    : `${API_URL_GLOBAL}/users/me`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ image }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erreur mise a jour de l'image de profil (${response.status}): ${errorText}`,
    );
  }

  return response.json();
}

export async function deleteUtilisateur() {
  const token = getToken() ?? "";

  if (local) {
    const response = await fetch(`${API_URL_LOCAL}/users/me`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/users/me`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  }
}

export async function postConnexion(
  adresse_email: string,
  password: string,
): Promise<Response> {
  const url = local
    ? `${API_URL_LOCAL}/auth/connexion`
    : `${API_URL_GLOBAL}/auth/connexion`;

  const reponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adresse_email, password }),
  });

  return reponse;
}

export async function login(adresse_email: string, password: string) {
  const token = getToken() ?? "";

  if (debug) {
    const mockUser: Utilisateur = {
      id_user: 1,
      nom: "Doe",
      prenom: "John",
      adresse_email: "john.doe@example.com",
      telephone: "1234567890",
      image: "https://thispersondoesnotexist.com/",
      date_naissance: "1990-01-01",
      password: "123",
      soldeDumois: 50,
    };
    loggedInUser = mockUser;
    return mockUser;
  } else if (local) {
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
/*
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
*/
export async function postForgotPassword(adresse_email: string) {
  const token = getToken() ?? "";

  const url = local
    ? `${API_URL_LOCAL}/auth/forgot-password`
    : `${API_URL_GLOBAL}/auth/forgot-password`;

  const reponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adresse_email }),
  });

  return reponse;
}
export async function postResetPassword(token: string, password: string) {
  const url = local
    ? `${API_URL_LOCAL}/auth/reset-password`
    : `${API_URL_GLOBAL}/auth/reset-password`;

  const reponse = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });

  return reponse;
}
