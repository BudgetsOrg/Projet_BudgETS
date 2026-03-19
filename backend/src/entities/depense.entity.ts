import { Column, Entity, PrimaryGeneratedColumn,ManyToOne, OneToOne } from 'typeorm';
import { Enveloppe } from './enveloppe.entity';
import { Categorie } from './categorie.entity';

@Entity()
export class Depense {
  @PrimaryGeneratedColumn()
  id_depense: number;

  @Column({length: 50})
  nom_depense: string;

  @Column('decimal', { precision: 10, scale: 2 })
  montant: number;

  @Column()
  Date: Date;

  @ManyToOne(() => Enveloppe, (enveloppe) => enveloppe.depenses,{ onDelete: 'CASCADE' })
  enveloppe: Enveloppe;

  @ManyToOne(() => Categorie, (categorie) => categorie.depenses)
  categorie: Categorie;
}
