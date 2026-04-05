import { Column, Entity, JoinColumn, ManyToOne, OneToMany,PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Depense } from './depense.entity';
import { User } from './user.entity';


@Entity()
export class Categorie {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id_categorie: number;
  
  @ApiProperty({ example: 'Alimentation' })
  @Column({length: 50, default: 'Catégorie'})
  nom_categorie: string;

  @ApiPropertyOptional({ example: 30 })
  @Column({ default: 0 })
  recurence: number;

  @ApiProperty({ type: [Depense] })
  @OneToMany(() => Depense, (depense) => depense.categorie)
  depenses: Depense[];

  //Relation, Attribut de navigation, Si le user est supprimé alors toutes ses catégories sont supprimées aussi (CASCADE)
  @ApiProperty({ type: () => User })
  @ManyToOne(() => User,(user)=> user.categories,{ onDelete: 'CASCADE' })
  user: User; //pour acceder à user quand on fait relation: ['user'] dans le service de catégorie

  @ApiProperty({ example: 1 })
  @Column()
  userId: number; //permet de stocker l'id du user sans get tout l'objet user
}
