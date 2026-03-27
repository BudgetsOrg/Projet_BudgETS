import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Enveloppe } from './enveloppe.entity';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id_budget: number;

  //valeur par défaut de 0 pour le solde du budget, avec precision pour la monnaie.
  @Column('decimal', { precision: 10, scale: 2 , default: 0 })
  soldeDuMois: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;

  //Relation, Attribut de navigation, Si le user est supprimé alors tous ses budgets sont supprimés aussi (CASCADE)
  @ManyToOne(() => User, (user) => user.budgets,{ onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Enveloppe, (enveloppe) => enveloppe.budget)
  enveloppes: Enveloppe[];
}