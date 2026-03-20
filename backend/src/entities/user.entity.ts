import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { Budget } from './budget.entity';
import { Objectif } from './objectif.entity';
import { Categorie } from './categorie.entity';

@Entity()
export class User {
  //PK User
  @PrimaryGeneratedColumn()
  id_user: number;

  //Tous les defaults values ont été pris du Figma
  @Column({length: 50, default: 'Nom'})
  nom: string;

  @Column({length: 50, default: 'Prénom'})
  prenom: string;

  @Column({unique: true, default: 'Adresse email'})
  adresse_email: string;

  //nullable + typage explicite pour le champ vu qu'il est nullable 
  @Column({ type: 'varchar',nullable: true, default: null })
  telephone?: string|null;

  @Column()
  password: string;

  @Column({type: 'varchar',nullable: true, default: null})
  image: string;

  //valeur default de 18 ans vu que notre appli cible les étudiants d'université.
  @Column({ default: () => "DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 18 YEAR)" })
  date_naissance: Date;

  // Relation, Attribut de navigation
  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @OneToMany(() => Objectif, (objectif) => objectif.users)
  objectifs: Objectif[];

  @OneToMany(() => Categorie, (categorie) => categorie.user)
  categories: Categorie[];
}
