import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
import { User } from './user.entity';
import { Enveloppe } from './enveloppe.entity';

@Entity()
export class Budget {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id_budget: number;

  //valeur par défaut de 0 pour le solde du budget, avec precision pour la monnaie.
  @ApiProperty({ example: 1500.50 })
  @Column('decimal', { precision: 10, scale: 2 , default: 0 })
  soldeDuMois: number;

  @ApiPropertyOptional({ example: '2023-01-01T00:00:00.000Z' })
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;

  //Relation, Attribut de navigation, Si le user est supprimé alors tous ses budgets sont supprimés aussi (CASCADE)
  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.budgets,{ onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ type: [Enveloppe] })
  @OneToMany(() => Enveloppe, (enveloppe) => enveloppe.budget)
  enveloppes: Enveloppe[];
}