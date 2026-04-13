import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty({ example: 'johndoe@exemple.com' })
    @IsEmail({}, { message: 'Format de courriel invalide' })
    @IsNotEmpty({ message: 'L\'adresse courriel est requise' })
    adresse_email: string;
}