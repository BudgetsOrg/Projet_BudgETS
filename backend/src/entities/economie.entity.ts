import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Objectif } from './objectif.entity';

@Entity()
export class Economie {
  @PrimaryGeneratedColumn()
  id_economie: number;

  @Column('decimal', { precision: 10, scale: 2 })
  montant: number;

  @Column()
  date: Date;

  @ManyToOne(() => Objectif, (objectif) => objectif.economies,{ onDelete: 'CASCADE' })
  objectif: Objectif;
}
