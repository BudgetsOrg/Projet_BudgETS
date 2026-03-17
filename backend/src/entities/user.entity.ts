
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column()
  nom: string;

  @Column()
  prenom: String;

  @Column()
  adresse_email: string
  
  @Column()
  telephone:string;

  @Column()
  password: string;

  @Column()
  image:string;

  @Column()
  date_naissance:Date;
    
}