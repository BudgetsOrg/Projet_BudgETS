import { IsEmail, IsNotEmpty, IsString } from "class-validator";




export class ConnexionDto{

    @IsEmail({}, { message: 'Format de courriel invalide' })
    @IsNotEmpty({ message: 'L\'adresse courriel est requise' })
    adresse_email: string;

    @IsString()
    @IsNotEmpty({ message: 'Le mot de passe est requis' })
    password: string;

}