
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Economie{
    @PrimaryGeneratedColumn()
      id_economie: number;

    @Column()
    montant: number;

    @Column()
    date: Date;

    //FK pour objectif
}