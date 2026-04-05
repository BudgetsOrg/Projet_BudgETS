import { IsNumber, IsPositive, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEconomieDto {
    @ApiPropertyOptional({ example: 200.00, description: 'Nouveau montant de l\'économie', required: false })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    montant?: number;

    @ApiPropertyOptional({ example: '2026-04-15', description: 'Nouvelle date de l\'économie', required: false })
    @IsOptional()
    @IsDateString()
    date?: string;
}