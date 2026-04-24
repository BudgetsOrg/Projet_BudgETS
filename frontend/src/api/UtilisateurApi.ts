// mes fonctions pour aller chercher les données à l'API
// par contre, nous sommes en debug pour l'instant donc debug = true et nous avons des données préparées.

import { getToken } from "../../public/token";
import type { Utilisateur } from "../interfaces";
let loggedInUser: Utilisateur | null = null;
const API_URL_GLOBAL = "https://budgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";
const debug = false;
const local = false;

// getUtilisateur, postUtilisateur, updateUtilisateur, updateUtilisateurImage, deleteUtilisateur, login,
// postConnexion, postForgotPassword, postResetPassword


// La fonction getUtilisateur permet de récuperer les informations de l'utilisateur comme le nom ou prenom.
// pour récuperer le bon Utilisateur on utilise le token qui permet de get l'utilisateur relier au jwt_token. 
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
// Cette méthode permet d'inserer un Utilisateur dans la base de données.
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

//Cette méthode permet de change certaine informations de l'utilisateur comme son nom,prénom etc.
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

//Cette méthode permet de modifier l'image qui en mémoire de l'utilisateur soit son logo.
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


// Cette fonction permet de retirer l'utilisateur de la base de données cette méthode retire l'utilisateur qui est relié au jwt_token
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

//Cette méthode permet que durant la connexion on get le jwt-token relier au email et password insérer.
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

//Cette méthode permet de faire le demander au mail pour reset le password.
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
//Cette méthode permet de changer le mdp associé au token.
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
