import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ObjectifDto } from './dto/objectif.dto';
import { AuthGuard } from '@nestjs/passport';
import { ObjectifRepository } from 'src/repositories';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';

@ApiBearerAuth() // Indique que les routes de ce contrôleur nécessitent une authentification par token Bearer (JWT) pour Swagger
@ApiResponse({ status: 401, description: 'Non autorisé' })
@UseGuards(AuthGuard('jwt')) // protège la route : seul un user connecté peut créer
@Controller('objectif')
export class ObjectifController {

    constructor( private readonly objectifService: ObjectifRepository) {};

    // Get('all-objectifs')
    // getAll{

    // }
    @ApiResponse({ status: 201, description: 'Objectif créé avec succès' })
    @ApiResponse({ status: 400, description: 'Requête invalide' })
    @Post()
    async create(@Body() dto: ObjectifDto, @Req() req: any) {
        // Grace a JwtStrategy, 'req.user' contient l'utilisateur trouvé en DB
        const userId = req.user.id; 
        
        // On appelle ton service avec les données du DTO et l'ID du user
        return this.objectifService.create(dto.montant, dto.titre, userId);
    }

}
