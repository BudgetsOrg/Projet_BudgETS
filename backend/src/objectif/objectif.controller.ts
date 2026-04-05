import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ObjectifDto } from './dto/objectif.dto';
import { AuthGuard } from '@nestjs/passport';

import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';
import { ObjectifService } from './objectif.service';
import { UpdateObjectifDto } from './dto/updateObjectif.dto';

@ApiBearerAuth() // Indique que les routes de ce contrôleur nécessitent une authentification par token Bearer (JWT) pour Swagger
@ApiResponse({ status: 401, description: 'Unauthorized' })
@UseGuards(AuthGuard('jwt')) // protège la route : seul un user connecté peut créer
@Controller('objectif')
export class ObjectifController {

    constructor( private readonly objectifService: ObjectifService) {};

    //url pour create
    @Post()
    async create(@Body() dto: ObjectifDto, @Req() req: any) {
        // Grace a JwtStrategy, 'req.user' contient l'utilisateur trouvé en DB
        const userId = req.user.id_user; 
        
        // On appelle ton service avec les données du DTO et l'ID du user
        return this.objectifService.create(dto,userId);
    }

    //url pour lire tout les objectifs
    @Get()
    async findAll(@Req() req: any) {
        return this.objectifService.findAll(req.user.id_user);
    }

    //url pour lire un objectif
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.objectifService.findOne(req.user.id_user, id);
    }

    //url pour update un objectif

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() dto: UpdateObjectifDto, 
        @Req() req: any
    ) {
        return this.objectifService.update(req.user.id_user, id, dto);
    }

    //url pour supprimer un objectif
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.objectifService.leaveOrDelete(id, req.user.id_user);
    }

    //url pour inviter

    @Post(':id/inviter')
    async inviteMember(
        @Param('id') id: number,
        @Body('email') email: string,
        @Req() req: any
    ) {
        // Optionnel : Vérifier d'abord si req.user.id_user est bien déjà membre de cet objectif 
        // pour éviter qu'un inconnu n'invite des gens dans ton projet iPhone !
        const inviterName = `${req.user.prenom} ${req.user.nom}`;
        return this.objectifService.addMember(id, email, inviterName);
    }
}
