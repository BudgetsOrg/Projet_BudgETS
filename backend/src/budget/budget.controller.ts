import { Controller, Post, Get, Patch, Delete, Param, Body, ParseIntPipe, UseGuards } from "@nestjs/common";
import { BudgetService } from "./budget.service";
import { Request } from "@nestjs/common"; //utilisé pour récupérer les informations de l'utilisateur connecté (req.user.id)
import { AuthGuard } from "@nestjs/passport/dist/auth.guard";
import { ApiBearerAuth, ApiResponse, ApiParam, ApiOperation } from "@nestjs/swagger";
import { Budget } from "src/entities/budget.entity";
import { CreateBudgetDto, UpdateBudgetDto } from "./dto";

@ApiBearerAuth() // Indique que les routes de ce contrôleur nécessitent une authentification par token Bearer (JWT) pour Swagger
@ApiResponse({ status: 401, description: 'Non autorisé' })
@UseGuards(AuthGuard('jwt'))//Valide le JWT du User avant de procéder aux opérations, si pas valide retourne 401 pas trouvé. 
@Controller('budget')
export class BudgetController{
    constructor(private readonly budgetService: BudgetService) { }

    //Prends les donées des champs lors de l'inscription et les envoie au service pour créer un nouveau budget.
    @ApiResponse({ status: 201, description: 'Retourne le budget créé', type: Budget })
    @ApiResponse({ status: 400, description: 'Requête invalide' })
    @Post()
    create(@Request() req, @Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetService.create(req.user.id, createBudgetDto);
    }
    
    //Récupère tous les budgets du user avec l'id du user obtenu du JWT
    @ApiOperation({ summary: 'Récupérer tous les budgets de l\'utilisateur' })
    @ApiResponse({ status: 200, description: 'Liste de tous les budgets avec enveloppes et dépenses' })
    @ApiResponse({ status: 404, description: 'Aucun budget trouvé pour cet utilisateur' })
    @Get('historique')
    findAll(@Request() req) {
    return this.budgetService.findAll(req.user.id);
    }

    //Récupère le budget du user avec l'id du budget obtenu du JWT
    @ApiOperation({ summary: 'Récupérer le budget le plus récent de l\'utilisateur' })
    @ApiResponse({ status: 200, description: 'Budget récupéré avec succès', type: Budget })
    @ApiResponse({ status: 404, description: 'Aucun budget trouvé pour cet utilisateur' })
    @Get('me')
    findOne(@Request() req) {
        return this.budgetService.findOne(req.user.id);
    }

    //Récupère le budget spécifique du user avec l'id du budget et l'id du user obtenus du JWT
    //ParseIntPipe pour convertir l'id du budget de string à number
    @ApiOperation({ summary: 'Récupérer un budget spécifique de l\'utilisateur' })
    @ApiParam({ name: 'id', type: Number, description: 'ID du budget' })
    @ApiResponse({ status: 200, description: 'Budget trouvé avec enveloppes, dépenses et catégories' })
    @ApiResponse({ status: 400, description: 'Requête invalide' })
    @ApiResponse({ status: 404, description: 'Budget non trouvé' })
    @Get(':id')
    findOneById(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.budgetService.findOneById(req.user.id, id);
    }

    //Permet de mettre à jour le budget du user avec l'id du budget et le nouveau solde du budget fournis par le dto
    @ApiResponse({ status: 200, description: 'Budget mis à jour avec succès', type: Budget })
    @ApiResponse({ status: 404, description: "Budget non trouvé" })
    @ApiResponse({ status: 400, description: "Requête invalide" })
    @ApiParam({ name: 'id', type: Number, example: 3, description: "L'id du budget à mettre à jour" })
    @Patch(':id')
    update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateBudgetDto: UpdateBudgetDto) {
        return this.budgetService.update(req.user.id, id, updateBudgetDto);
    }

    //Permet de supprimer le budget du user avec l'id du budget
    @ApiResponse({ status: 200, description: 'Budget supprimé avec succès', type: Budget })
    @ApiResponse({ status: 404, description: "Budget non trouvé" })
    @ApiResponse({ status: 400, description: "Requête invalide" })
    @ApiParam({ name: 'id', type: Number, example: 3, description: "L'id du budget à supprimer" })
    @Delete(':id')
    remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.budgetService.delete(req.user.id, id);
    }
}