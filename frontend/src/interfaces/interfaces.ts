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

export interface Budget {
  id_budget: number;
  solde: number;
  date_creation: Date;
  user_id: number;
}

export interface Objectif {
  id_objectif: number;
  titre: string;
  montant: number;
  date_limite: Date;
  image: string;
  user_id: number;
}

export interface User {
  id_user: number;
  nom: string;
  prenom: string;
  adresse_email: string;
  telephone: string;
  image: string;
  date_naissance: Date;
}
