import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger/dist/decorators/api-property.decorator";
import { IsDateString, IsNumber, IsOptional,Min } from "class-validator";

export class CreateBudgetDto {
    @ApiProperty({ example: 1500.00, description: 'Solde du mois en cours' })
    @IsNumber({maxDecimalPlaces: 2})
    @Min(0)
    soldeDuMois: number;
}
