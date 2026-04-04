import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Budget } from './budget.entity';
import { Objectif } from './objectif.entity';
import { Categorie } from './categorie.entity';

@Entity()
export class User {
  
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id_user: number;

  //Tous les defaults values ont été pris du Figma
  @ApiProperty({ example: 'Doe' })
  @Column({length: 50})
  nom: string;

  @ApiProperty({ example: 'John' })
  @Column({length: 50})
  prenom: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @Column({unique: true})
  adresse_email: string;

  //nullable + typage explicite pour le champ vu qu'il est nullable 
  @ApiPropertyOptional({ example: '+1234567890', nullable: true })
  @Column({ type: 'varchar',nullable: true, default: null })
  telephone?: string|null;

  @ApiProperty({ example: 'hashedpassword' })
  @Column()
  password: string;

  @ApiProperty({ example: '2000-01-01' })
  @Column({ type:'date' })
  date_naissance: Date;


  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', nullable: true })
  @Column({type: 'varchar',nullable: true, default: null})
  image: string;

  // Relation, Attribut de navigation
  @ApiProperty({ type: [Budget] })
  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @ApiProperty({ type: [Objectif] })
  @OneToMany(() => Objectif, (objectif) => objectif.users)
  objectifs: Objectif[];

  @ApiProperty({ type: [Categorie] })
  @OneToMany(() => Categorie, (categorie) => categorie.user)
  categories: Categorie[];
}
