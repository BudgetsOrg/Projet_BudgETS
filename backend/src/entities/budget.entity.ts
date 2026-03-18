
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Budget{
    @PrimaryGeneratedColumn()
      id_budget: number;

    @Column()
    solde: number;

    //FK pour enveloppe
}