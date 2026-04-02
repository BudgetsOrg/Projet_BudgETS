import { Controller, Get, Post, Patch, Delete, Param, Body, Request, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiParam } from '@nestjs/swagger';
import { CategorieService } from './categorie.service';
import { CreateCategorieDto } from './dto/create_categorie.dto';
import { UpdateCategorieDto } from './dto/update_categorie.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';

@ApiBearerAuth() // Indique que les routes de ce contrôleur nécessitent une authentification par token Bearer (JWT) pour Swagger
@UseGuards(AuthGuard('jwt')) //Valide le JWT du User avant de procéder aux opérations, si pas valide retourne 401 pas trouvé.
@ApiResponse({ status: 401, description: 'Unauthorized' })
@Controller('categorie')
export class CategorieController {
    constructor(private readonly categorieService: CategorieService) {}

    //Prends les donées des champs lors de la création d'une catégorie et les envoie au service pour créer une nouvelle catégorie.
    @ApiResponse({ status: 200, description: 'Catégorie créée avec succès' })
    @ApiResponse({ status: 400, description: 'Requête invalide pour créer une catégorie' })
    @Post()
    create(@Request() req, @Body() createCategorieDto: CreateCategorieDto) {
        return this.categorieService.create(req.user.id, createCategorieDto);
    }

    //Récupère toutes les catégories du user avec l'id du user obtenu du JWT
    @ApiResponse({ status: 200, description: 'Liste des catégories récupérée avec succès' })
    @ApiResponse({ status: 404, description: "{ message: 'Catégorie non trouvée' }" })
    @Get()
    findAll(@Request() req) {
        return this.categorieService.findAll(req.user.id);
    }

    //Récupère une catégorie spécifique du user avec l'id de la catégorie et l'id du user obtenus du JWT
    @ApiResponse({ status: 200, description: 'Catégorie récupérée avec succès' })
    @ApiResponse({ status: 404, description: "{ message: 'Catégorie non trouvée' }" })
    @ApiResponse({ status: 400, description: "{ message: 'Pas la bonne requête pour récupérer la catégorie' }" })
    @ApiParam({ name: 'id', type: Number, example: 3, description: "L'id de la catégorie à récupérer" })
    @Get(':id')
    findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.categorieService.findOne(req.user.id, id);
    }

    //Permet de mettre à jour une catégorie du user avec l'id de la catégorie et les champs fournis par le dto
    @ApiResponse({ status: 200, description: 'Catégorie mise à jour avec succès' })
    @ApiResponse({ status: 404, description: "{ message: 'Catégorie non trouvée' }" })
    @ApiResponse({ status: 400, description: "{ message: 'Pas la bonne requête pour mettre à jour la catégorie' }" })
    @ApiParam({ name: 'id', type: Number, example: 3, description: "L'id de la catégorie à mettre à jour" })
    @Patch(':id')
    update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateCategorieDto: UpdateCategorieDto) {
        return this.categorieService.update(req.user.id, id, updateCategorieDto);
    }

    //Permet de supprimer une catégorie du user avec l'id de la catégorie et l'id du user obtenus du JWT
    @ApiResponse({ status: 200, description: 'Catégorie supprimée avec succès' })
    @ApiResponse({ status: 404, description: "{ message: 'Catégorie non trouvée' }" })
    @ApiResponse({ status: 400, description: "{ message: 'Pas la bonne requête pour supprimer la catégorie' }" })
    @ApiParam({ name: 'id', type: Number, example: 3, description: "L'id de la catégorie à supprimer" })
    @Delete(':id')
    remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.categorieService.remove(req.user.id, id);
    }
}