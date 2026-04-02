import { ApiPropertyOptional } from "@nestjs/swagger/dist/decorators/api-property.decorator";
import { IsNumber, IsPositive, Min } from "class-validator";

export class UpdateBudgetDto {
    @ApiPropertyOptional({ example: 1800.00 })
    @IsNumber({maxDecimalPlaces: 2})
    @Min(0)
    soldeDuMois: number;
}