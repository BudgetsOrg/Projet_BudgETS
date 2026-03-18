import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Enveloppe } from "src/entities";
import { Repository } from "typeorm";

// @Injectable() :"C'est un outil (service) que les autres 
// classes peuvent utiliser."
@Injectable()
export class EnveloppeService{

    constructor(
        @InjectRepository( Enveloppe ) 
        private enveloppeRepository: Repository<Enveloppe>) {}  


    // Récupère toutes les enveloppes présentes dans la base de données
    async getAll() {
        return await this.enveloppeRepository.find();
    }
        
//     async getAll() {
//     const enveloppes = await this.enveloppeRepository.find({
//       take: , // Prend la limite si fournie, sinon retourne tout
//     });
//     // console.log("Movies returned:", movies.length); 
//     return enveloppes;
//   }


}