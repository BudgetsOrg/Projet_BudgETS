import { Type } from 'class-transformer';
import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

//Le DTO définit exactement quelles données ton backend s'attend à recevoir 
//quand quelqu'un remplit le formulaire sur ton interface

//class validator
//$ npm i --save class-validator class-transformer

export class InscriptionDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  nom: string;

  @IsString()
  @IsNotEmpty({ message: 'Le prénom est obligatoire' })
  prenom: string;

  @IsEmail({}, { message: 'Format de courriel invalide' })
  @IsNotEmpty({message: 'L\'adresse courriel est requise '})
  adresse_email: string;

  @IsString()
  @MinLength(6, { message: 'Le mot de passe doit faire au moins 6 caractères' })
  password: string;

  @IsDateString({}, { message: 'La date de naissance doit être valide (AAAA-MM-JJ)' })
  @IsNotEmpty()
  date_naissance: string;

  // on met IsOptional car le telephone est facultatif
  @IsString()
  @IsOptional()
  telephone: string;

  @IsNotEmpty({ message: 'Le solde initial est obligatoire' })
  // convertit la String reçue du JSON en type Number AVANT la validation
  @Type(() => Number)
  @IsNumber()
  soldeDumois: number;

}