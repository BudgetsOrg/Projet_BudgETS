
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Enveloppe{
    @PrimaryGeneratedColumn()
      id_objectif: number;

    @Column()
    titre: string;

    @Column()
    budget: number;

    @Column()
    image: string;
}