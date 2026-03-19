import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Objectif } from './objectif.entity';

@Entity()
export class Economie {
  @PrimaryGeneratedColumn()
  id_economie: number;

  @Column('decimal', { precision: 10, scale: 2 , default: 0 })
  montant: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => Objectif, (objectif) => objectif.economies,{ onDelete: 'CASCADE' })
  objectif: Objectif;
}
