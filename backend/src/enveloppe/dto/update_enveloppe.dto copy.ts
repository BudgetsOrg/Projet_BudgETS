import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from "class-validator";

export class CreateEnveloppeDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    titre: string;
    
    @IsOptional()
    @IsNumber({maxDecimalPlaces: 2})
    @IsPositive()
    montant: number;

    @IsOptional()
    @IsString()
    image?: string;
}
