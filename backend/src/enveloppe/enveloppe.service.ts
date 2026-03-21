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
       const enveloppres= await this.enveloppeRepository.find();
       return enveloppres
    }
    

}