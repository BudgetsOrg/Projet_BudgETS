import { IsString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class UpdateDepenseDto {
    //Tout les champs sont optionnels pour permettre une mise à jour partielle de la dépense
    @ApiPropertyOptional({ example: 'Achat épicerie', description: 'Nom de la dépense, optionel' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    nom_depense?: string;

    @ApiPropertyOptional({ example: 150.75, description: 'Montant de la dépense, optionel' })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    montant?: number;

    @ApiPropertyOptional({ example: '2023-10-10', description: 'Date de la dépense, optionel' })
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiPropertyOptional({ example: false, description: 'Indique si la dépense est récurrente, optionel' })
    @IsOptional()
    @IsBoolean()
    recurrente?: boolean;

    @ApiPropertyOptional({ example: 1, description: 'ID de la catégorie associée, optionnel' })
    @IsOptional()
    @IsNumber()
    categorieId?: number;
}