import { Column, Entity, ManyToOne, OneToMany,PrimaryGeneratedColumn } from 'typeorm';
import { Depense } from './depense.entity';
import { User } from './user.entity';


@Entity()
export class Categorie {
  @PrimaryGeneratedColumn()
  id_categorie: number;

  @Column({length: 50})
  nom_categorie: string;

  @Column()
  recurence: number;

  @OneToMany(() => Depense, (depense) => depense.categorie)
  depenses: Depense[];

  @ManyToOne(() => User,(user)=> user.categories,{ onDelete: 'CASCADE' })
  user: User;
}
