import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
    @IsEmail({}, { message: 'Format de courriel invalide' })
    @IsNotEmpty({ message: 'L\'adresse courriel est requise' })
    adresse_email: string;
}