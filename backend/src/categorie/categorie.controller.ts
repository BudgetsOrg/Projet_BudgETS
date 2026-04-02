import { Controller, Get, Post, Patch, Delete, Param, Body, Request, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { CreateCategorieDto } from './dto/create_categorie.dto';
import { UpdateCategorieDto } from './dto/update_categorie.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

@UseGuards(AuthGuard('jwt')) //Valide le JWT du User avant de procéder aux opérations, si pas valide retourne 401 pas trouvé.
@Controller('categorie')
export class CategorieController {
    constructor(private readonly categorieService: CategorieService) {}

    //Prends les donées des champs lors de la création d'une catégorie et les envoie au service pour créer une nouvelle catégorie.
    @Post()
    create(@Request() req, @Body() createCategorieDto: CreateCategorieDto) {
        return this.categorieService.create(req.user.id, createCategorieDto);
    }

    //Récupère toutes les catégories du user avec l'id du user obtenu du JWT
    @Get()
    findAll(@Request() req) {
        return this.categorieService.findAll(req.user.id);
    }

    //Récupère une catégorie spécifique du user avec l'id de la catégorie et l'id du user obtenus du JWT
    @Get(':id')
    findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.categorieService.findOne(req.user.id, id);
    }

    //Permet de mettre à jour une catégorie du user avec l'id de la catégorie et les champs fournis par le dto
    @Patch(':id')
    update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateCategorieDto: UpdateCategorieDto) {
        return this.categorieService.update(req.user.id, id, updateCategorieDto);
    }

    //Permet de supprimer une catégorie du user avec l'id de la catégorie et l'id du user obtenus du JWT
    @Delete(':id')
    remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.categorieService.remove(req.user.id, id);
    }
}