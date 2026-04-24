export interface Enveloppe {
  id_enveloppe: number;
  titre: string;
  montant: number;
  image?: string;
}

export type EnveloppeCreate = Omit<Enveloppe, "id_enveloppe">;

// pour le pie chart
export interface Data {
  title: string;
  value: number;
  color: string;
}


//Interface pour stocker le budget.
export interface Budget {
  id_budget?: number;
  soldeDuMois: number;
  date_creation: string | Date;
  user_id?: Utilisateur;
  objectifs?: Objectif[];
  enveloppes?: Enveloppe[];
  categories?: Categorie[];
}

// En rendant falcultatif la majoritées des attributs 
// on permets de modifier ce que l'en veux sans devoir inserer une valeurs pour tous les attributs.
//Interface pour stocker et gerer les objectifs.
export interface Objectif {
  id_objectif?: number;
  titre: string;
  montant?: number;
  date_limite?: string;
  image: string;
  users: Utilisateur[];
}



// En rendant falcultatif la majoritées des attributs 
// on permets de modifier ce que l'en veux sans devoir inserer une valeurs pour tous les attributs.
//Interface pour gerer et stocker les Utilisateurs.
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


// En rendant falcultatif la majoritées des attributs 
// on permets de modifier ce que l'en veux sans devoir inserer une valeurs pour tous les attributs.
//Interface pour gerer et stocker les Depenses.
export interface Depense {
  id_depense: number;
  nom_depense: string;
  montant: number;
  date: string;
  recurente: boolean;
  enveloppeId: number;
  categorieId: number;
}


// En rendant falcultatif la majoritées des attributs 
// on permets de modifier ce que l'en veux sans devoir inserer une valeurs pour tous les attributs.
//Interface pour gerer et stocker les Categories.
export interface Categorie {
  id_categorie: number;
  nom_categorie: string;
  recurence: number;
  depenses: Depense[];
  id_user: number;
}




// En rendant falcultatif la majoritées des attributs 
// on permets de modifier ce que l'en veux sans devoir inserer une valeurs pour tous les attributs.

//Interface pour gerer et stocker les Économies.

export interface Economie {
  id_economie: number;
  montant: number;
  date: string;
  objectifId: number;
}
