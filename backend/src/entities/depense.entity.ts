import { Column, Entity, PrimaryGeneratedColumn,ManyToOne, OneToOne } from 'typeorm';
import { Enveloppe } from './enveloppe.entity';
import { Categorie } from './categorie.entity';

@Entity()
export class Depense {
  @PrimaryGeneratedColumn()
  id_depense: number;

  @Column({length: 50, default: 'Dépense'})
  nom_depense: string;

  //valeur par défaut de 0 pour le montant de la dépense, avec precision pour la monnaie.
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  montant: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  //Relation, Attribut de navigation, Si l'enveloppe est supprimée alors toutes les dépenses associées sont supprimées aussi (CASCADE)
  @ManyToOne(() => Enveloppe, (enveloppe) => enveloppe.depenses,{ onDelete: 'CASCADE' })
  enveloppe: Enveloppe;

  @ManyToOne(() => Categorie, (categorie) => categorie.depenses)
  categorie: Categorie;
}
