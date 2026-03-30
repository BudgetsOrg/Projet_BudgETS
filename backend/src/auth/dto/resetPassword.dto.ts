import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty()
    token: string;

    @IsString()
    @MinLength(6, { message: 'Le mot de passe doit avoir au moins 6 caractères' })
    password: string; // Le nouveau mot de passe
}