import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Budget } from './budget.entity';
import { Depense } from './depense.entity';

@Entity()
export class Enveloppe {
  @PrimaryGeneratedColumn()
  id_enveloppe: number;

  @Column()
  titre: string;

  //rajouter contrainte: < solde.budget
  @Column()
  montant: number;

  @Column({type: 'varchar',nullable: true})
  image?: string|null;

  @ManyToOne(() => Budget, (budget) => budget.enveloppes)
  budget: Budget;

  @OneToMany(() => Depense, (depense) => depense.enveloppe)
  depenses: Depense[];
}
