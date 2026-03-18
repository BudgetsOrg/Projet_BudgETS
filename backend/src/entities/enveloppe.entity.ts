import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Enveloppe {
  @PrimaryGeneratedColumn()
  id_objectif: number;

  @Column()
  titre: string;

  //rajouter contrainte: < solde.budget
  @Column()
  montant: number;

  @Column({nullable: true})
  image?: string|null;
}
