import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Depense } from './depense.entity';


@Entity()
export class Categorie {
  @PrimaryGeneratedColumn()
  id_categorie: number;

  @Column()
  nom_categorie: string;

  @Column()
  recurence: number;

  @OneToOne(() => Depense, (depense) => depense.categorie)
  depenses: Depense;
}
