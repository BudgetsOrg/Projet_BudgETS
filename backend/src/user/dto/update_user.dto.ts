import { ApiPropertyOptional } from "@nestjs/swagger/dist/decorators/api-property.decorator";
import { IsString, IsNotEmpty, IsOptional, IsDateString } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Doe', description: 'Nom de famille de l\'utilisateur' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nom?: string;

  @ApiPropertyOptional({ example: 'John', description: 'Prénom de l\'utilisateur' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  prenom?: string;

  @ApiPropertyOptional({ example: '5144504500', description: 'Numéro de téléphone de l\'utilisateur' })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiPropertyOptional({ example: '2000-01-01', description: 'Date de naissance de l\'utilisateur' })
  @IsOptional()
  @IsDateString()
  date_naissance?: Date;

  @ApiPropertyOptional({example: 'image.jpg', description: 'URL de l\'image de profil de l\'utilisateur'})
  @IsOptional()
  image_url?: string;
}