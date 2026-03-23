import { Controller, Post, Get, Patch, Delete, Param, Body, ParseIntPipe } from "@nestjs/common";
import { BudgetService } from "./budget.service";
import { CreateBudgetDto } from "./dto/create_budget.dto";
import { UpdateBudgetDto } from "./dto/update_budget.dto";


@Controller('budget')
export class BudgetController{
    constructor(private readonly budgetService: BudgetService) {}

    //Prends les donées des champs lors de l'inscription et les envoie au service pour créer un nouveau budget.
    @Post()
    create(@Body() createBudgetDto: CreateBudgetDto) {
        return this.budgetService.create(createBudgetDto);
    }

    //Récupère le budget du user avec l'id du budget
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.budgetService.findOne(id);
    }

    //Plans futur: findAll pour récupérer tous les budgets d'un user avec l'historique (Sprint 2)

    //Permet de mettre à jour le budget du user avec l'id du budget et le nouveau solde du budget fournis par le dto
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateBudgetDto: UpdateBudgetDto) {
        return this.budgetService.update(id, updateBudgetDto);
    }

    //Permet de supprimer le budget du user avec l'id du budget
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.budgetService.delete(id);
    }
}