


export class CreateUserDto {
  nom: string;
  prenom: string;
  adresse_email: string;
  date_naissance: Date;
  mot_de_passe: string; // recu en clair du frontend
  soldeDumois: number;
}