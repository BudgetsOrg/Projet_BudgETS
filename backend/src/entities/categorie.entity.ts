import { Column, Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm/browser";

@Entity()
export class Categorie {
    @PrimaryGeneratedColumn()
    id_categorie: number;
    
    @Column()
    nom_categorie: string;

    @Column()
    recurence: number;
}