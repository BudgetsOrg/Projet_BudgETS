import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Budget } from './budget.entity';
import { Depense } from './depense.entity';

@Entity()
export class Enveloppe {
  @PrimaryGeneratedColumn()
  id_enveloppe: number;

  @Column({length: 100, default: 'Enveloppe'})
  titre: string;

  //rajouter contrainte: < solde.budget
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  montant: number;

  //nullable + typage explicite pour le champ vu qu'il est nullable 
  @Column({type: 'varchar',nullable: true, default: null})
  image?: string|null;

  //Relation, Attribut de navigation, Si le budget est supprimé alors toutes les enveloppes associées sont supprimées aussi (CASCADE)
  @ManyToOne(() => Budget, (budget) => budget.enveloppes,{ onDelete: 'CASCADE' })
  budget: Budget;

  @OneToMany(() => Depense, (depense) => depense.enveloppe)
  depenses: Depense[];
}
