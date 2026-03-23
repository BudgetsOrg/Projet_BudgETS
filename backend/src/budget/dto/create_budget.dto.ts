import { IsDateString, IsNumber, IsPositive, Min } from "class-validator";

export class CreateBudgetDto {
    @IsNumber({maxDecimalPlaces: 2})
    @Min(0)
    @IsPositive()
    solde: number;

    @IsDateString()
    date_creation: Date

    @IsNumber()
    id_user: number;
}
