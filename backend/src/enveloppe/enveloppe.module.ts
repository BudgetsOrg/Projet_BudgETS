import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Enveloppe } from "src/entities";
import { EnveloppeService } from "./enveloppe.service";
import { EnveloppeController } from "./enveloppe.controller";



/*Un décorateur, c'est comme une étiquette intelligente que l'on colle 
 au-dessus d'une classe, d'une fonction ou d'une variable pour lui donner 
des super-pouvoirs ou définir son rôle.
*/

// En NestJS (et en TypeScript), ils commencent toujours par un @.

//le decorator @Module(): C'est le chef d'orchestre : il rassemble les services et les contrôleurs.

@Module({
    // imports : Liste les autres modules ou entités (via TypeOrm).
    imports: [TypeOrmModule.forFeature([Enveloppe])],
    // controllers : Définit les "portes d'entrée" de l'API (les routes GET, POST, etc.) pour répondre aux requêtes.
    controllers: [EnveloppeController],
    // providers : Contient les services qui cachent la logique métier et les calculs complexes du projet.
    providers: [EnveloppeService]   
})

export class EnveloppeModule{};
