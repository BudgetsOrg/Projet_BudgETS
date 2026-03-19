import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Economie } from './economie.entity';

@Entity()
export class Objectif {
  @PrimaryGeneratedColumn()
  id_objectif: number;

  @Column({length: 100})
  titre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  montant: number;

  @Column({ type: 'varchar', nullable: true })
  image?: string | null;

  @Column()
  date_limite: Date;

  @ManyToMany(() => User, (user) => user.objectifs)
  users: User[];

  @OneToMany(() => Economie, (economie) => economie.objectif)
  economies: Economie[];
  //   @Column({ type: 'date' })
  //   date: string;

  // Relation avec l'utilisateur Exemple
  // @ManyToOne(() => User, (user) => user.objectif, {
  //   onDelete: 'CASCADE' //<- pour drop en cascade exemple
  // })
  // user: User;
}
