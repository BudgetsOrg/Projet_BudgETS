import { IsString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsDateString } from 'class-validator';

export class UpdateDepenseDto {
    //Tout les champs sont optionnels pour permettre une mise à jour partielle de la dépense
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    nom_depense?: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    montant?: number;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsNumber()
    categorieId?: number;
}