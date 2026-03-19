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

  @Column({type: 'varchar',nullable: true, default: null})
  image?: string|null;

  @ManyToOne(() => Budget, (budget) => budget.enveloppes,{ onDelete: 'CASCADE' })
  budget: Budget;

  @OneToMany(() => Depense, (depense) => depense.enveloppe)
  depenses: Depense[];
}
