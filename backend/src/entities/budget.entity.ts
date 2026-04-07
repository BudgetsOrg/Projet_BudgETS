import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
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

  //date de création du budget, avec une valeur par défaut de la date actuelle.
  @ApiProperty({ example: '2023-04-01T00:00:00.000Z' })
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;

  //Relation, Attribut de navigation, Si le user est supprimé alors tous ses budgets sont supprimés aussi (CASCADE)
  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.budgets,{ onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ type: [Enveloppe] })
  @OneToMany(() => Enveloppe, (enveloppe) => enveloppe.budget)
  enveloppes: Enveloppe[];

  //On set le cham de date_creation à la première date du mois
  @BeforeInsert()
  setDateCreation() {
    const now = new Date();
    this.date_creation = new Date(now.getFullYear(), now.getMonth(), 1);
  }
}