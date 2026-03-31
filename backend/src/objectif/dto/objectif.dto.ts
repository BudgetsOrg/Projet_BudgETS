import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";


export class ObjectifDTO {
    @IsString()
    @IsNotEmpty({ message: 'Vous devez lui donner un titre' })
    titre: string;

    @IsNumber({}, { message: 'Vous devez insérer un nombre' })
    @IsNotEmpty({ message: 'Ce champ ne peut être vide' })
    @IsPositive({ message: 'Le montant doit être supérieur à zéro' }) 
    montant: number;
}