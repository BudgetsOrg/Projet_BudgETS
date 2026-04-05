import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class UpdateCategorieDto {
    //Les deux sont optionnels pour permettre la mise à jour partielle d'une catégorie.
    @ApiPropertyOptional({ example: 'Nourriture', description: 'Nom de la catégorie, optionnel' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    nom_categorie?: string;

    @ApiPropertyOptional({ example: 0, description: 'Récurrence de la catégorie en jours, optionnel' })
    @IsOptional()
    @IsNumber()
    recurence?: number;
}