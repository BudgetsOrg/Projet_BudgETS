import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Objectif } from './objectif.entity';

@Entity()
export class Economie {
  @PrimaryGeneratedColumn()
  id_economie: number;

  //valeur par défaut de 0 pour le montant de l'économie, avec precision pour la monnaie.
  @Column('decimal', { precision: 10, scale: 2 , default: 0 })
  montant: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  //Relation, Attribut de navigation, Si l'objectif est supprimé alors toutes les économies associées sont supprimées aussi (CASCADE)
  @ManyToOne(() => Objectif, (objectif) => objectif.economies,{ onDelete: 'CASCADE' })
  objectif: Objectif;
}
