import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  //rajouter les FK pour categorie et enveloppe
}
