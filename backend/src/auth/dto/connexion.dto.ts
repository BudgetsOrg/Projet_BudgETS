import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class ConnexionDto{
    @ApiProperty({ example: 'johndoe@example.com', description: 'Adresse email de l\'utilisateur' })
    @IsEmail({}, { message: 'Format de courriel invalide' })
    @IsNotEmpty({ message: 'L\'adresse courriel est requise' })
    adresse_email: string;

    @ApiProperty({ example: 'password123', description: 'Mot de passe de l\'utilisateur' })
    @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
    @IsNotEmpty({ message: 'Le mot de passe est requis' })
    password: string;

}