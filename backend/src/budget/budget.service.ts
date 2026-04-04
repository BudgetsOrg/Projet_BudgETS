import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Budget} from "src/entities";
import { Repository } from "typeorm/repository/Repository.js";
import { UpdateBudgetDto } from "./dto/update_budget.dto";
import { CreateBudgetDto } from "./dto/create_budget.dto";


@Injectable()
export class BudgetService{
    constructor(
        @InjectRepository(Budget)
        private budgetRepository: Repository<Budget>,
    ) {}

    async create(userId: number, createBudgetDto: CreateBudgetDto) {
    const budget = this.budgetRepository.create({ //cree une entité budget à partir du DTO createBudgetDto et l'id du user
        ...createBudgetDto,
        user: { id_user: userId },
    });
    return this.budgetRepository.save(budget); //sauvegarde l'entité budget dans la base de données et retourne le budget créé au frontend
    }

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

    async findAll(userId: number) {
        //retourne tous les budgets de l'utilisateur avec les enveloppes et les dépenses associées, 
        //triés par date de création décroissante pour retourner le budget le plus récent
        return this.budgetRepository.find({
            where: { user: { id_user: userId } },
            relations: ['enveloppes'],
            order: { date_creation: 'DESC' },
        });
    }      

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

}