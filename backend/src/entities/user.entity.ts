import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Budget } from './budget.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  adresse_email: string;

  //nullable
  @Column({ type: 'varchar',nullable: true })
  telephone?: string|null;

  @Column()
  password: string;

  @Column()
  image: string;

  @Column()
  date_naissance: Date;

//
}
