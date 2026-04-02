import { IsDateString, IsNumber, IsOptional,Min } from "class-validator";

export class CreateBudgetDto {
    @IsNumber({maxDecimalPlaces: 2})
    @Min(0)
    soldeDuMois: number;

    @IsDateString()
    @IsOptional()
    date_creation: Date
}
