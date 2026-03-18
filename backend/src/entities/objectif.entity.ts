import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Objectif {
  @PrimaryGeneratedColumn()
  id_objectif: number;

  @Column()
  titre: string;

  @Column()
  montant: number;

  @Column({ type: 'varchar', nullable: true })
  image?: string | null;

  //   @Column({ type: 'date' })
  //   date: string;

  // Relation avec l'utilisateur Exemple
  // @ManyToOne(() => User, (user) => user.objectif, {
  //   onDelete: 'CASCADE' //<- pour drop en cascade exemple
  // })
  // user: User;
}
