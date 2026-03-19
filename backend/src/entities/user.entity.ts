import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { Budget } from './budget.entity';
import { Objectif } from './objectif.entity';
import { Categorie } from './categorie.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({length: 50, default: 'Nom'})
  nom: string;

  @Column({length: 50, default: 'Prénom'})
  prenom: string;

  @Column({unique: true, default: 'Adresse email'})
  adresse_email: string;

  //nullable
  @Column({ type: 'varchar',nullable: true, default: null })
  telephone?: string|null;

  @Column()
  password: string;

  @Column({type: 'varchar',nullable: true, default: null})
  image: string;

  @Column({ default: () => "DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 18 YEAR)" })
  date_naissance: Date;

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @OneToMany(() => Objectif, (objectif) => objectif.users)
  objectifs: Objectif[];

  @OneToMany(() => Categorie, (categorie) => categorie.user)
  categories: Categorie[];
}
