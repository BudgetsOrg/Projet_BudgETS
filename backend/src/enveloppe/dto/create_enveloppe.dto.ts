import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from "class-validator";

export class CreateEnveloppeDto {
    @IsString()
    @IsNotEmpty()
    titre: string;
    
    @IsNumber({maxDecimalPlaces: 2})
    @IsPositive()
    montant: number;

    @IsOptional()
    @IsString()
    image?: string;
}
