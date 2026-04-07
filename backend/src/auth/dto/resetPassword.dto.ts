import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({ example: 'jwt token reçu par courriel', description: 'Token de réinitialisation reçu par courriel' })
    @IsNotEmpty()
    token: string;

    @ApiProperty({ example: 'NouveauMotDePasse123', description: 'Nouveau mot de passe' })
    @IsString()
    @MinLength(6, { message: 'Le mot de passe doit avoir au moins 6 caractères' })
    password: string; // Le nouveau mot de passe
}