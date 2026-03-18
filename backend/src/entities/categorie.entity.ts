import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class Categorie {
  @PrimaryGeneratedColumn()
  id_categorie: number;

  @Column()
  nom_categorie: string;

  @Column()
  recurence: number;
}
