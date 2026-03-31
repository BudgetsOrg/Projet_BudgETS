import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { Economie } from './economie.entity';

@Entity()
export class Objectif {
  @PrimaryGeneratedColumn()
  id_objectif: number;

  @Column({length: 100, default: 'Objectif'})
  titre: string;

  //valeur par défaut de 0 pour le solde du budget, avec precision pour la monnaie.
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  montant: number;

  //valeur default de 18 ans vu que notre appli cible les étudiants d'université.
  @Column({ type: 'varchar', nullable: true, default: null })
  image?: string | null;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_limite: Date;

  // //Relation, Attribut de navigation, Si le user est supprimé alors tous ses objectifs sont supprimés aussi (CASCADE)
  // @ManyToOne(() => User, (user) => user.objectifs,{ onDelete: 'CASCADE' })
  // users: User;
  // Changement ici : Plusieurs users peuvent partager un objectif
  @ManyToMany(() => User, (user) => user.objectifs)
  @JoinTable({ name: 'user_objectifs' }) // table de liaison
  users: User[]

  // @OneToMany(() => Economie, (economie) => economie.objectif)
  // economies: Economie[];
  
  // Les économies restent liées à l'objectif
  @OneToMany(() => Economie, (economie) => economie.objectif, { cascade: true })
  economies: Economie[];
}
