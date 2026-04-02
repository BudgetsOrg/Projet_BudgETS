import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from "class-validator";
import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";

export class CreateEnveloppeDto {
    @ApiProperty({ example: 'Alimentation', description: 'Titre de l\'enveloppe' })
    @IsString()
    @IsNotEmpty()
    titre: string;
    
    @ApiProperty({ example: 1000, description: 'Montant de l\'enveloppe' })
    @IsNumber({maxDecimalPlaces: 2})
    @IsPositive()
    montant: number;

    @ApiProperty({ example: 'image.jpg', description: 'Image de l\'enveloppe' })
    @IsOptional()
    @IsString()
    image?: string;
}
