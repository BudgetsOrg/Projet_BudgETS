import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Budget, Enveloppe } from "src/entities";
import { EnveloppeService } from "./enveloppe.service";
import { EnveloppeController } from "./enveloppe.controller";



@Module({
    // imports : Liste les autres modules ou entités (via TypeOrm).
    imports: [TypeOrmModule.forFeature([Enveloppe,Budget])],
    // controllers : Définit les "portes d'entrée" de l'API (les routes GET, POST, etc.) pour répondre aux requêtes.
    controllers: [EnveloppeController],
    // providers : Contient les services qui cachent la logique métier et les calculs complexes du projet.
    providers: [EnveloppeService]   
})

export class EnveloppeModule{};
