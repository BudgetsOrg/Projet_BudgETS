import { IsDecimal, IsNumber, IsPositive, Min } from "class-validator";

export class UpdateBudgetDto {
    @IsNumber({maxDecimalPlaces: 2})
    @Min(0)
    @IsPositive()
    solde: number;
}