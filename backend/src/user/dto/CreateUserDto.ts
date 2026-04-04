import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";
import { IsDateString, IsString, IsNotEmpty, IsNumber, Min } from "class-validator";


export class CreateUserDto {
  @ApiProperty({ example: 'Doe', description: 'Nom de famille de l\'utilisateur' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'John', description: 'Prénom de l\'utilisateur' })
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Adresse email de l\'utilisateur' })
  @IsString()
  @IsNotEmpty()
  adresse_email: string;

  @ApiProperty({ example: '2000-01-01', description: 'Date de naissance de l\'utilisateur' })
  @IsDateString()
  date_naissance: Date;

  @ApiProperty({ example: 'password123', description: 'Mot de passe de l\'utilisateur' })
  @IsString()
  @IsNotEmpty()
  mot_de_passe: string; // recu en clair du frontend

  @ApiProperty({ example: 1800.00, description: 'Solde du mois de l\'utilisateur' })
  @IsNumber({maxDecimalPlaces: 2})
  @Min(0)
  soldeDumois: number;
}