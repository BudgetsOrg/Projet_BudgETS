import { getToken } from "../../public/token";
import type { Objectif } from "../interfaces";

const API_URL_GLOBAL = "https://budgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";

const debug = false;
// choose one
const local = false;

// getObjectif, inviteUtilisateurObjectif, postObjectif, deleteObjectif, updateObjectif, inviteUtilisateurObjectif


// Cette objectif va nous permettre de get les objectifs qui sont associé à un Utilisateur pour
// les affichers dans la page Principale.
export async function getObjectif() {
  const token = getToken() ?? "";

  const baseUrl = local ? API_URL_LOCAL : API_URL_GLOBAL;
  const response = await fetch(`${baseUrl}/objectif`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}


//Cette méthode permet de changer les informations d'un objectifs dans la base de données.
export async function updateObjectif(objectif: Objectif) {
  const token = getToken() ?? "";

  const baseUrl = local ? API_URL_LOCAL : API_URL_GLOBAL;

  const response = await fetch(`${baseUrl}/objectif/${objectif.id_objectif}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(objectif),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erreur mise a jour objectif (${response.status}): ${errorText}`,
    );
  }

  return response.json();
}

// Cette méthode permet de supprimer un objectif de la base de données et elle prend en paramètre le id de l'objectif à supprimer.
export async function deleteObjectif(id_objectif: number) {
  const token = getToken() ?? "";

  const baseUrl = local ? API_URL_LOCAL : API_URL_GLOBAL;

  const response = await fetch(`${baseUrl}/objectif/${id_objectif}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erreur suppression objectif (${response.status}): ${errorText}`,
    );
  }
  console.log(`Objectif with id ${id_objectif} deleted successfully.`);

  // Au lieu de prendre response.json(), on prend le text et on parse pour éviter les erreurs de parsing quand il n'y a pas de contenu
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

//Cette méthode permet d'ajouter un objectif cette action sera faite dans la page principale.
export async function postObjectif(objectif: Objectif) {
  const token = getToken() ?? "";

  const baseUrl = local ? API_URL_LOCAL : API_URL_GLOBAL;

  const response = await fetch(`${baseUrl}/objectif`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(objectif),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erreur création objectif (${response.status}): ${errorText}`,
    );
  }

  return response.json();
}

//Cette méthode permet d'ajouter un utilisateur à un objectif.
//Une fois que le deuxième utilisatuer a été invité ça rend l'objectif commun et accessible aux différents utilisateur qui sont dans l'objectifs.
export async function inviteUtilisateurObjectif(
  id_objectif: number,
  email: string,
) {
  const token = getToken() ?? "";

  const baseUrl = local ? API_URL_LOCAL : API_URL_GLOBAL;

  const response = await fetch(`${baseUrl}/objectif/${id_objectif}/inviter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email: email.trim() }),
  });

  const data = await response.text();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data,
    };
  }

  return JSON.parse(data);
}
