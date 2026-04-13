import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';
import { ObjectifService } from './objectif.service';
import { ObjectifDto, ObjectifInviterDto, UpdateObjectifDto } from './dto';


@ApiBearerAuth() // Indique que les routes de ce contrôleur nécessitent une authentification par token Bearer (JWT) pour Swagger
@ApiResponse({ status: 401, description: 'Non autorisé' })
@UseGuards(AuthGuard('jwt')) // protège la route : seul un user connecté peut créer
@Controller('objectif')
export class ObjectifController {
  constructor(private readonly objectifService: ObjectifService) {}

  
  //url pour cree un objectif pis le lie a un user
  // JwtStrategy(ill se trouve dans auth) , 'req.user' contient l'utilisateur trouvé en DB
  @ApiResponse({ status: 201, description: 'Objectif créé avec succès' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @Post()
  async create(
    @Body() dto: ObjectifDto, 
    @Req() req: any) {
    const userId = req.user.id;
    return this.objectifService.create(dto, userId);
  }

  //url pour lire tout les objectifs
  @ApiResponse({
    status: 200,
    description: 'Liste des objectifs récupérée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Objectifs non trouvés' })
  @ApiOperation({ summary: "Récupérer tous les objectifs de l'utilisateur" })
  @Get()
  async findAll(
    @Req() req: any) {
    return this.objectifService.findAll(req.user.id);
  }

  //url pour lire un objectif
  @ApiResponse({ status: 200, description: 'Objectif récupéré avec succès' })
  @ApiResponse({ status: 404, description: 'Objectif non trouvé' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiOperation({ summary: 'Récupérer un objectif par son ID' })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any) {
    return this.objectifService.findOne(req.user.id, id);
  }

  //url pour update un objectif
  @ApiResponse({ status: 200, description: 'Objectif mis à jour avec succès' })
  @ApiResponse({ status: 404, description: 'Objectif non trouvé' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateObjectifDto,
    @Req() req: any,
  ) {
    return this.objectifService.update(req.user.id, id, dto);
  }

  //url pour supprimer un objectif
  @ApiResponse({ status: 200, description: 'Objectif supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Objectif non trouvé' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number, 
    @Req() req: any) {
    return this.objectifService.leaveOrDelete(id, req.user.id);
  }

  //url pour inviter
  @ApiResponse({ status: 200, description: 'Membre invité avec succès' })
  @ApiResponse({ status: 404, description: 'Ressource non trouvée' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiOperation({ summary: 'Inviter un membre à rejoindre un objectif' })
  @Post(':id/inviter')
  async inviteMember(
    @Param('id') id: number,
    @Body() dto: ObjectifInviterDto,
    @Req() req: any,
  ) {
    const inviterName = `${req.user.prenom} ${req.user.nom}`;
    return this.objectifService.addMember(id, dto.email, inviterName);
  }
}
