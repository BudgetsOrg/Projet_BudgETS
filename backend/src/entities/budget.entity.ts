import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Enveloppe } from './enveloppe.entity';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id_budget: number;

  @Column('decimal', { precision: 10, scale: 2 , default: 0 })
  solde: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;

  @ManyToOne(() => User, (user) => user.budgets,{ onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Enveloppe, (enveloppe) => enveloppe.budget)
  enveloppes: Enveloppe[];
}

//check pour tout les soldes pas < 0
//All efault values for fields that require it.