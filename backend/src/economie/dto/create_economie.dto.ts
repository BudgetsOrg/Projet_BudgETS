import { IsNumber, IsPositive, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEconomieDto {
    @ApiProperty({ example: 150.00, description: 'Montant de l\'économie' })
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    montant: number;

    @ApiProperty({ example: '2026-03-31', description: 'Date de l\'économie', required: false })
    @IsOptional()
    @IsDateString()
    date?: string;

    @ApiProperty({ example: 1, description: 'ID de l\'objectif associé' })
    @IsNumber()
    objectifId: number;
}