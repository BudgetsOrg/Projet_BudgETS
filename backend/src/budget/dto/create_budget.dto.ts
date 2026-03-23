import { IsDateString, IsDecimal, IsNumber, IsPositive, Min } from "class-validator";

export class CreateBudgetDto {
    @IsNumber()
    @Min(0)
    @IsPositive()
    @IsDecimal({ decimal_digits: '2'})
    solde: number;

    @IsDateString()
    date_creation: Date

    @IsNumber()
    id_user: number;
}
