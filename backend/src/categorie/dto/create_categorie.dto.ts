import {IsNotEmpty, IsString, MaxLength} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class CreateCategorieDto {
    @ApiProperty({ example: 'Nourriture', description: 'Nom de la catégorie' })
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    nom_categorie: string;
    // Je n'ai pas inclus la recurence dans le DTO puisqu'il est set à default : 0 dans l'entité
}


