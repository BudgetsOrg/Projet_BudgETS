import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateCategorieDto {
    //Les deux sont optionnels pour permettre la mise à jour partielle d'une catégorie.
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    nom_categorie?: string;

    @IsOptional()
    @IsNumber()
    recurence?: number;
}