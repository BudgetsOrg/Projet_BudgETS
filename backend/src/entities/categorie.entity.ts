import { Column, Entity, ManyToOne, OneToMany,PrimaryGeneratedColumn } from 'typeorm';
import { Depense } from './depense.entity';
import { User } from './user.entity';


@Entity()
export class Categorie {
  @PrimaryGeneratedColumn()
  id_categorie: number;
  
  @Column({length: 50, default: 'Catégorie'})
  nom_categorie: string;

  @Column({ default: 0 })
  recurence: number;

  @OneToMany(() => Depense, (depense) => depense.categorie) 
  depenses: Depense[];

  //Relation, Attribut de navigation, Si le user est supprimé alors toutes ses catégories sont supprimées aussi (CASCADE)
  @ManyToOne(() => User,(user)=> user.categories,{ onDelete: 'CASCADE' })
  user: User; //pour acceder à user quand on fait relation: ['user'] dans le service de catégorie

  @Column()
  userId: number; //permet de stocker l'id du user sans get tout l'objet user
}
