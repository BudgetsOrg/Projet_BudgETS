export interface Enveloppe {
  id_enveloppe: number;
  titre: string;
  montant: number;
  image?: string;
}

// pour le pie chart
export interface Data {
  title: string;
  value: number;
  color: string;
}

export interface Budget {
  id_budget?: number;
  soldeDuMois: number;
  date_creation: string | Date;
  user_id?: Utilisateur;
  objectifs?: Objectif[];
  enveloppes?: Enveloppe[];
  categories?: Categorie[];
}

// à faire
export interface Objectif {
  id_objectif?: number;
  titre: string;
  montant?: number;
  date_limite?: string;
  image: string;
  userId?: number;
}

export interface Utilisateur {
  id_user?: number;
  nom: string;
  prenom: string;
  adresse_email: string;
  password?: string;
  date_naissance?: string;
  telephone?: string;
  image?: string;
  soldeDumois?: number;
}

// vérifier l'id
export interface Depense {
  id_depense: number;
  nom_depense: string;
  montant: number;
  date: string;
  recurente: boolean;
  enveloppeId: number;
  categorieId: number;
}

// à faire
export interface Categorie {
  id_categorie: number;
  nom_categorie: string;
  recurence: number;
  depenses: Depense[];
  id_user: number;
}

// vérifier l'id
export interface Economie {
  id_economie: number;
  montant: number;
  date: string;
  objectifId: number;
}
