import { Column, Entity, PrimaryGeneratedColumn,ManyToOne, OneToOne } from 'typeorm';
import { Enveloppe } from './enveloppe.entity';
import { Categorie } from './categorie.entity';

@Entity()
export class Depense {
  @PrimaryGeneratedColumn()
  id_depense: number;

  @Column()
  nom_depense: string;

  @Column()
  montant: number;

  @Column()
  Date: Date;

  @ManyToOne(() => Enveloppe, (enveloppe) => enveloppe.depenses)
  enveloppe: Enveloppe;

  @OneToOne(() => Categorie, (categorie) => categorie.depenses)
  categorie: Categorie;
}
