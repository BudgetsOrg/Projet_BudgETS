import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { Budget } from './budget.entity';
import { Objectif } from './objectif.entity';
import { Categorie } from './categorie.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({length: 50})
  nom: string;

  @Column({length: 50})
  prenom: string;

  @Column({unique: true})
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

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @OneToMany(() => Objectif, (objectif) => objectif.users)
  objectifs: Objectif[];

  @OneToMany(() => Categorie, (categorie) => categorie.user)
  categories: Categorie[];
}
