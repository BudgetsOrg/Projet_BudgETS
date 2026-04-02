import { Type } from 'class-transformer';
import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import{ ApiProperty, ApiPropertyOptional } from "@nestjs/swagger/dist/decorators/api-property.decorator";
//Le DTO définit exactement quelles données ton backend s'attend à recevoir 
//quand quelqu'un remplit le formulaire sur ton interface

//class validator
//$ npm i --save class-validator class-transformer

export class InscriptionDto {
  @ApiProperty({ example: 'Doe', description: 'Nom de famille de l\'utilisateur' })
  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  nom: string;

  @ApiProperty({ example: 'John', description: 'Prénom de l\'utilisateur' })
  @IsString()
  @IsNotEmpty({ message: 'Le prénom est obligatoire' })
  prenom: string;

  @ApiProperty({ example: 'johndoe@example.com', description: 'Adresse email de l\'utilisateur' })
  @IsEmail({}, { message: 'Format de courriel invalide' })
  @IsNotEmpty({message: 'L\'adresse courriel est requise '})
  adresse_email: string;

  @ApiProperty({ example: 'password123', description: 'Mot de passe de l\'utilisateur' })
  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit faire au moins 6 caractères' })
  password: string;

  @ApiProperty({ example: '2000-01-01', description: 'Date de naissance de l\'utilisateur' })
  @IsDateString({}, { message: 'La date de naissance doit être valide (AAAA-MM-JJ)' })
  @IsNotEmpty()
  date_naissance: string;

  // on met IsOptional car le telephone est facultatif
  @ApiPropertyOptional({ example: '+1234567890', description: 'Numéro de téléphone de l\'utilisateur' })
  @IsString()
  @IsOptional()
  telephone: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg', description: 'URL de l\'image de l\'utilisateur' })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({ example: 1800.00, description: 'Solde du mois de l\'utilisateur' })
  @IsNotEmpty({ message: 'Le solde initial est obligatoire' })
  // convertit la String reçue du JSON en type Number AVANT la validation
  @Type(() => Number)
  @IsNumber()
  soldeDumois: number;

}