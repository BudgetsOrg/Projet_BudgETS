import {IsNotEmpty, IsString, MaxLength} from 'class-validator';

export class CreateCategorieDto {
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    nom_categorie: string;
    // Je n'ai pas inclus la recurence dans le DTO puisqu'il est set à default : 0 dans l'entité
}


