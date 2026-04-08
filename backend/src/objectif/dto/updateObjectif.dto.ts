import { PartialType } from '@nestjs/mapped-types';
import { ObjectifDto } from './objectif.dto';

export class UpdateObjectifDto extends PartialType(ObjectifDto) {}

/**
 * PartialType :
 * il sert a conserver toutes les proprietes et leur validations mais il ajoute automatiquement 
 * un equivalent  de @IsOptional() a chaque champ 
 */