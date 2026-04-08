import { ApiPropertyOptional } from "@nestjs/swagger/dist/decorators/api-property.decorator";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

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
}