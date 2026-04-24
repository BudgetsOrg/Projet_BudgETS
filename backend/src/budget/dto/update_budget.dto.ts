import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";
import { IsNumber, Min } from "class-validator";

export class UpdateBudgetDto {
    @ApiProperty({ example: 1800.00 })
    @IsNumber({maxDecimalPlaces: 2})
    @Min(0)
    soldeDuMois: number;
}