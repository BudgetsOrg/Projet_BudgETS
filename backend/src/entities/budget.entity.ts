import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Enveloppe } from './enveloppe.entity';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id_budget: number;

  @Column()
  solde: number;

  @Column()
  date_creation: Date;

  @ManyToOne(() => User, (user) => user.budgets)
  user: User;

  @OneToMany(() => Enveloppe, (enveloppe) => enveloppe.budget)
  enveloppes: Enveloppe[];
}
