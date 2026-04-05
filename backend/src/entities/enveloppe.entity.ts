import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Budget } from './budget.entity';
import { Depense } from './depense.entity';

@Entity()
export class Enveloppe {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id_enveloppe: number;

  @ApiProperty({ example: 'Enveloppe Nourriture' })
  @Column({length: 100, default: 'Enveloppe'})
  titre: string;

  //rajouter contrainte: < solde.budget
  @ApiProperty({ example: 300.00 })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  montant: number;

  //nullable + typage explicite pour le champ vu qu'il est nullable 
  @ApiPropertyOptional({ example: 'https://example.com/image.jpg', nullable: true })
  @Column({type: 'varchar',nullable: true, default: null})
  image?: string|null;

  //Relation, Attribut de navigation, Si le budget est supprimé alors toutes les enveloppes associées sont supprimées aussi (CASCADE)
  @ApiProperty({ type: () => Budget })
  @ManyToOne(() => Budget, (budget) => budget.enveloppes,{ onDelete: 'CASCADE' })
  budget: Budget;

  @ApiProperty({ type: [Depense] })
  @OneToMany(() => Depense, (depense) => depense.enveloppe)
  depenses: Depense[];
}
