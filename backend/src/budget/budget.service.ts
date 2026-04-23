import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Budget, User } from "src/entities";
import { Repository } from "typeorm/repository/Repository.js";
import { CreateBudgetDto, UpdateBudgetDto } from "./dto";



@Injectable()
export class BudgetService{
    constructor(
        @InjectRepository(Budget)
        private budgetRepository: Repository<Budget>,
    ) {}

    async create(userId: number, createBudgetDto: CreateBudgetDto) {
    const budget = this.budgetRepository.create(createBudgetDto);
    budget.user = { id_user: userId } as User;  // assigned after, not passed into create()
    return this.budgetRepository.save(budget);
}

    //Le budget le plus récent de l'utilisateur
    async findOne(userId: number) {
        const budget = await this.budgetRepository.findOne({
            where: { user: { id_user: userId } }, //comme un JOIN entre budget et user pour trouver le budget associé à l'id du user
            relations: ['enveloppes'],
            order: { date_creation: 'DESC' }, // retourne le budget le plus courant pour l'utilisateur.
        });

        if (!budget) { //pour une reponse 404
            throw new NotFoundException('Aucun budget trouvé pour cet utilisateur');
        }

        return budget;
    }

    //Historique
    async findAll(userId: number) {
        //retourne tous les budgets de l'utilisateur avec les enveloppes et les dépenses associées, 
        //triés par date de création décroissante pour retourner le budget le plus récent
        return this.budgetRepository.find({
            where: { user: { id_user: userId } },
            relations: ['enveloppes'],
            order: { date_creation: 'DESC' },
        });
    }      

    //Un budget spécifique
    async findOneById(userId: number, id: number) {
        const budget = await this.budgetRepository.findOne({
            where: { id_budget: id, user: { id_user: userId } },
            relations: ['enveloppes'],
        });

        if (!budget) {
            throw new NotFoundException('Budget non trouvé');
        }

        return budget;
    }

    async update(userId: number, id: number, updateBudgetDto: UpdateBudgetDto) {
        await this.checkEnveloppesTotal(userId, id, updateBudgetDto.soldeDuMois);
        const budget = await this.budgetRepository.findOne({
            where: { id_budget: id, user: { id_user: userId } }, //validation pour s'assurer que le budget appartient à l'utilisateur qui essaie de le mettre à jour
        });

        if (!budget) {//pour une reponse 404 - si le budget n'existe pas ou pas le bon user
            throw new NotFoundException('Budget non trouvé');
        }

        Object.assign(budget, updateBudgetDto); //coie les champs de updateBudgetDto dans l'entité budget existante
        return this.budgetRepository.save(budget);
    }

    async delete(userId: number, id: number) {
        const budget = await this.budgetRepository.findOne({
            where: { id_budget: id, user: { id_user: userId } },
        });

        if (!budget) {
            throw new NotFoundException('Budget non trouvé');
        }

        await this.budgetRepository.remove(budget); //attend la reponse de bd avant de retourner le message de succès
        return { message: 'Budget supprimé avec succès' };
    }

    private async checkEnveloppesTotal(userId: number, budgetId: number, newSolde: number) {
        const budget = await this.budgetRepository.findOne({
            where: { id_budget: budgetId, user: { id_user: userId } },
            relations: ['enveloppes'],
        });

        if (!budget) throw new NotFoundException('Budget non trouvé');

        const totalAllocated = budget.enveloppes
            .reduce((sum, env) => sum + Number(env.montant), 0);

        if (newSolde < totalAllocated) {
            throw new BadRequestException('Le solde ne peut pas être inférieur au total des enveloppes.');
        }
    }   
}