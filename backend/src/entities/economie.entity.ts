import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Objectif } from './objectif.entity';

@Entity()
export class Economie {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id_economie: number;

  //valeur par défaut de 0 pour le montant de l'économie, avec precision pour la monnaie.
  @ApiProperty({ example: 100.00 })
  @Column('decimal', { precision: 10, scale: 2 , default: 0 })
  montant: number;

  @ApiProperty({ example: '2023-02-01T00:00:00.000Z' })
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  //Relation, Attribut de navigation, Si l'objectif est supprimé alors toutes les économies associées sont supprimées aussi (CASCADE)
  @ApiProperty({ type: () => Objectif })
  @ManyToOne(() => Objectif, (objectif) => objectif.economies,{ onDelete: 'CASCADE' })
  objectif: Objectif;
}
