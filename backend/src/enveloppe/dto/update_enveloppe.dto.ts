import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class UpdateEnveloppeDto {
    @ApiPropertyOptional({ example: 'Alimentation', description: 'Titre de l\'enveloppe' })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    titre?: string;
    
    @ApiPropertyOptional({ example: 1000, description: 'Montant de l\'enveloppe' })
    @IsOptional()
    @IsNumber({maxDecimalPlaces: 2})
    @IsPositive()
    montant?: number;

    @ApiPropertyOptional({ example: 'image.jpg', description: 'Image de l\'enveloppe' })
    @IsOptional()
    @IsString()
    image?: string;
}
