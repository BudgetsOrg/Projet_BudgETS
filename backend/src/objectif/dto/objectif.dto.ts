import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";


export class ObjectifDto {
    @ApiProperty({ example: 'Char Usagé', description: 'Titre de l\'objectif' })
    @IsString()
    @IsNotEmpty({ message: 'Vous devez lui donner un titre' })
    titre: string;

    @ApiProperty({ example: 8500, description: 'Montant de l\'objectif' })
    @IsNumber({}, { message: 'Vous devez insérer un nombre' })
    @IsNotEmpty({ message: 'Ce champ ne peut être vide' })
    @IsPositive({ message: 'Le montant doit être supérieur à zéro' }) 
    montant: number;

    @ApiProperty({ example: 'https://example.com/char.jpg', description: 'URL de l\'image de l\'objectif' })
    @IsString()
    @IsOptional()
    image?:string;
}