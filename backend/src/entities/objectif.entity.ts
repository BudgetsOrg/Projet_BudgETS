
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Objectif {
  @PrimaryGeneratedColumn()
  id_objectif: number;

  @Column()
  titre: string;

  @Column()
  montant: number;

  //tu peux mettre @IsOptional
  @Column()
  image: string;

//   @Column({ type: 'date' })
//   date: string;

  // Relation avec l'utilisateur Exemple
  // @ManyToOne(() => User, (user) => user.objectif, { 
  //   onDelete: 'CASCADE' //<- pour drop en cascade exemple
  // })
  // user: User;
  
}