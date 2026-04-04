import { Column, Entity, PrimaryGeneratedColumn,ManyToOne, OneToOne } from 'typeorm';
import { ApiProperty,ApiPropertyOptional } from '@nestjs/swagger';
import { Enveloppe } from './enveloppe.entity';
import { Categorie } from './categorie.entity';

@Entity()
export class Depense {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id_depense: number;

  @ApiProperty({ example: 'Courses' })
  @Column({length: 50, default: 'Dépense'})
  nom_depense: string;

  //valeur par défaut de 0 pour le montant de la dépense, avec precision pour la monnaie.
  @ApiProperty({ example: 50.00 })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  montant: number;
  
  @ApiPropertyOptional({ example: '2023-01-15T00:00:00.000Z' })
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  //Relation, Attribut de navigation, Si l'enveloppe est supprimée alors toutes les dépenses associées sont supprimées aussi (CASCADE)
  @ApiProperty({ type: () => Enveloppe })
  @ManyToOne(() => Enveloppe, (enveloppe) => enveloppe.depenses,{ onDelete: 'CASCADE' })
  enveloppe: Enveloppe;

  @ApiProperty({ type: () => Categorie })
  @ManyToOne(() => Categorie, (categorie) => categorie.depenses)
  categorie: Categorie;
}
