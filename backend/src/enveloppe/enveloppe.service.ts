import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Budget, Enveloppe } from "src/entities";
import { Not, Repository } from "typeorm";
import { CreateEnveloppeDto } from "./dto/create_enveloppe.dto";

// @Injectable() :"C'est un outil (service) que les autres 
// classes peuvent utiliser."
@Injectable()
export class EnveloppeService{

    constructor(
        @InjectRepository( Enveloppe ) 
        private enveloppeRepository: Repository<Enveloppe>,
    
        @InjectRepository(Budget) 
        private budgetRepository: Repository<Budget>
    ) {}  

    async create(userId: number, createEnveloppeDto: CreateEnveloppeDto) {
        const budget = await this.budgetRepository.findOne({
            where: { user: { id_user: userId } },
            relations: ['enveloppes'],
            order: { date_creation: 'DESC' }
        });
    }

    async findAll(userId: number) {
        const budget = await this.budgetRepository.findOne({
            where: { user: { id_user: userId } },
            relations: ['enveloppes'],
            order: { date_creation: 'DESC' }
        });

        if (!budget) {
            throw new NotFoundException('Aucun budget trouvé pour cet utilisateur'); 
        }

        return budget.enveloppes;
    }
    
    async findOne(userId: number, id: number) {
        
    }

    async update(userId: number, updateEnveloppeDto: CreateEnveloppeDto, id: number) {
        
    }

    async remove(userId: number, id: number) {
        
    }
}