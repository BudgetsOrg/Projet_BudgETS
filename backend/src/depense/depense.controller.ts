import { Controller, Get, Post, Patch, Delete, Param, Body, Request, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiParam, ApiOperation, ApiBody } from '@nestjs/swagger';
import { DepenseService } from './depense.service';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';
import { CreateDepenseDto, UpdateDepenseDto } from './dto';

@ApiBearerAuth() // Indique que les routes de ce contrôleur nécessitent une authentification par token Bearer (JWT) pour Swagger
@UseGuards(AuthGuard('jwt'))
@ApiResponse({ status: 401, description: 'Non autorisé' })
@Controller('depense')
export class DepenseController {
    constructor(private readonly depenseService: DepenseService) {}

    //Permet de créer une dépense en utilisant les données fournies par le DTO et l'id du user obtenu du JWT
    @ApiResponse({ status: 201, description: 'Dépense créée avec succès' })
    @ApiResponse({ status: 404, description: "Enveloppe non trouvée" })
    @ApiResponse({ status: 400, description: "Requête invalide" })
    @Post()
    create(@Request() req, @Body() createDepenseDto: CreateDepenseDto) {
        return this.depenseService.create(req.user.id, createDepenseDto);
    }

    //Permet de récupérer toutes les dépenses associées à une enveloppe spécifique pour l'utilisateur connecté
    @ApiOperation({ summary: 'Récupérer toutes les dépenses d\'une enveloppe' })
    @ApiResponse({ status: 200, description: 'Dépenses récupérées avec succès' })
    @ApiResponse({ status: 404, description: 'Enveloppe non trouvée' })
    @ApiResponse({ status: 400, description: 'Requête invalide' })
    @ApiParam({ name: 'enveloppeId', type: Number, example: 3, description: "L'id de l'enveloppe pour laquelle récupérer les dépenses" })
    @Get('enveloppe/:enveloppeId')
    findAllByEnveloppe(@Request() req, @Param('enveloppeId', ParseIntPipe) enveloppeId: number) {
        return this.depenseService.findAllByEnveloppe(req.user.id, enveloppeId);
    }

    //Permet de récupérer une dépense spécifique pour l'utilisateur connecté
    @ApiOperation({ summary: 'Récupérer une dépense spécifique' })
    @ApiResponse({ status: 200, description: 'Dépense récupérée avec succès' })
    @ApiResponse({ status: 404, description: 'Dépense non trouvée' })
    @ApiResponse({ status: 400, description: 'Requête invalide' })
    @ApiParam({ name: 'id', type: Number, example: 3, description: "L'id de la dépense à récupérer" })
    @Get(':id')
    findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.depenseService.findOne(req.user.id, id);
    }

    //Permet de mettre à jour une dépense spécifique pour l'utilisateur connecté en utilisant les données fournies par le DTO
    @ApiResponse({ status: 200, description: 'Dépense mise à jour avec succès' })
    @ApiResponse({ status: 404, description: 'Dépense non trouvée' })
    @ApiResponse({ status: 400, description: 'Requête invalide' })
    @ApiParam({ name: 'id', type: Number, example: 3, description: "L'id de la dépense à mettre à jour" })
    @Patch(':id')
    update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateDepenseDto: UpdateDepenseDto) {
        return this.depenseService.update(req.user.id, id, updateDepenseDto);
    }

    //Permet de supprimer une dépense spécifique pour l'utilisateur connecté
    @ApiResponse({ status: 200, description: 'Dépense supprimée avec succès' })
    @ApiResponse({ status: 404, description: 'Dépense non trouvée' })
    @ApiResponse({ status: 400, description: 'Requête invalide' })
    @ApiParam({ name: 'id', type: Number, example: 3, description: "L'id de la dépense à supprimer" })
    @Delete(':id')
    remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.depenseService.remove(req.user.id, id);
    }
}