
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Depense {
   @PrimaryGeneratedColumn()
    id_depense: number;

    @Column()
    nom_depense: string;

    @Column()
    montant: Number;

    @Column()
    Date: Date;

    //rajouter pour categorie la relation 

}