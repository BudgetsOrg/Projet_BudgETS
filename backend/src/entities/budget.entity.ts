import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id_budget: number;

  @Column()
  solde: number;

  //FK pour enveloppe

  @ManyToOne(() => User, (user) => user.budget)
  user: User;
}
