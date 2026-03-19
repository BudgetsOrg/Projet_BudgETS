import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Budget } from './budget.entity';
import { Objectif } from './objectif.entity';

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

  @ManyToMany(() => Objectif, (objectif) => objectif.users)
  @JoinTable() // seulement sur le coté de l'entité qui possède la relation.
  objectifs: Objectif[];
}
