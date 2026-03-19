import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Economie } from './economie.entity';

@Entity()
export class Objectif {
  @PrimaryGeneratedColumn()
  id_objectif: number;

  @Column({length: 100, default: 'Objectif'})
  titre: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  montant: number;

  @Column({ type: 'varchar', nullable: true, default: null })
  image?: string | null;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_limite: Date;

  @ManyToOne(() => User, (user) => user.objectifs,{ onDelete: 'CASCADE' })
  users: User;

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
