import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger/dist/decorators/api-property.decorator";
import { IsDateString, IsNumber, IsOptional,Min } from "class-validator";

export class CreateBudgetDto {
    @ApiProperty({ example: 1500.00, description: 'Solde du mois en cours' })
    @IsNumber({maxDecimalPlaces: 2})
    @Min(0)
    soldeDuMois: number;

    @ApiPropertyOptional({ example: '2026-03-01', description: 'Date du budget, le défaut c\'est le 1er du mois actuel' })
    @IsOptional()
    @IsDateString()
    date_creation?: string;
}
