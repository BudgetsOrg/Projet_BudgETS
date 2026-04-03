// 1. Define an interface to describe the shape of the JSON object
export interface Enveloppe {
  id_enveloppe: number;
  titre: string;
  montant: number;
  image: string;
}

export interface Obj {
  id: number;
  name: string;
  image: string;
}

export interface Data {
  title: string;
  value: number;
  color: string;
}

// i think this is wrong !
export interface Budget {
  id_budget: number;
  solde: number;
  date_creation: Date;
}

export interface Objectif {
  id_objectif: number;
  titre: string;
  montant: number;
  date_limite: Date;
  image: string;
  user_id: number;
}

export interface Utilisateur {
  id_user?: number;
  nom: string;
  prenom: string;
  adresse_email: string;
  password: string;
  date_naissance: string;
  telephone?: string;
  image?: string;
  solde_du_mois: number;
}

export interface Depense {
  id?: number;
  titre: string;
  categorie: string;
  prix: number;
  date: string;
}
