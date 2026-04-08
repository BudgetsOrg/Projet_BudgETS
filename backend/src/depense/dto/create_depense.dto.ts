import { IsString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class CreateDepenseDto{
    @ApiProperty({ example: 'Achat épicerie', description: 'Nom de la dépense' })
    @IsString()
    @IsNotEmpty()
    nom_depense: string;

    @ApiProperty({ example: 150.75, description: 'Montant de la dépense' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    montant: number;

    //Optionnel pcq si pas fourni, date défault c'est current timestamp dans la bd
    @ApiPropertyOptional({ example: '2023-10-10', description: 'Date de la dépense, optionel' })
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiProperty({ example: 1, description: 'ID de l\'enveloppe associée' })
    @IsNumber()
    enveloppeId: number;

    //Depense ne requiert pas nécessairement une catégorie
    @ApiPropertyOptional({ example: 1, description: 'ID de la catégorie associée, optionnel' })
    @IsOptional()
    @IsNumber()
    categorieId?: number;
}