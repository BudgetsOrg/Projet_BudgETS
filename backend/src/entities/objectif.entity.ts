
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Objectif {
  @PrimaryGeneratedColumn()
  id_objectif: number;

  @Column()
  titre: string;

  @Column()
  montant: number;

  @Column()
  image: string;

//   @Column({ type: 'date' })
//   date: string;
    
}