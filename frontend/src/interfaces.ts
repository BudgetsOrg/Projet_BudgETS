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
  id_budget?: number;
  soldeDuMois?: number;
  solde?: number; // API may return `solde` instead of `soldeDuMois`
  date_creation: string | Date;
  user_id?: Utilisateur;
  objectifs?: Objectif[];
  enveloppes?: Enveloppe[];
  categories?: Categorie[];
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
  soldeDumois: number;
}

export interface Depense {
  id?: number;
  titre: string;
  categorie: string;
  prix: number;
  date: string;
}

export interface Categorie {
  id_categorie: number;
  nom_categorie: string;
  recurence: number;
  depenses: Depense[];
  user_id: number;
}
