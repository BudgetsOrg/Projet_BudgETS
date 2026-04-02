import { IsString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsDateString } from 'class-validator';

export class CreateDepenseDto{
    @IsString()
    @IsNotEmpty()
    nom_depense: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    montant: number;

    //Optionnel pcq si pas fourni, date défault c'est current timestamp dans la bd
    @IsOptional()
    @IsDateString()
    date?: string;

    @IsNumber()
    enveloppeId: number;

    //Depense ne requiert pas nécessairement une catégorie
    @IsOptional()
    @IsNumber()
    categorieId?: number;
}