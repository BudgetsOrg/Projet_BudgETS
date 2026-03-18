import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Objectif } from './objectif.entity';

@Entity()
export class Economie {
  @PrimaryGeneratedColumn()
  id_economie: number;

  @Column()
  montant: number;

  @Column()
  date: Date;

  @ManyToOne(() => Objectif, (objectif) => objectif.economies)
  objectif: Objectif;
}
