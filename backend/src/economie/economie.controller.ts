import { Controller, Get, Post, Patch, Delete, Param, Body, Request, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EconomieService } from './economie.service';
import { CreateEconomieDto } from './dto/create_economie.dto';
import { UpdateEconomieDto } from './dto/update_economie.dto';

@ApiResponse({ status: 401, description: 'Non autorisé' })
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('economie')
export class EconomieController {
    constructor(private readonly economieService: EconomieService) {}

    @Post()
    @ApiResponse({ status: 201, description: 'Économie créée avec succès' })
    @ApiResponse({ status: 404, description: 'Objectif non trouvé' })
    @ApiResponse({ status: 400, description: 'Requête invalide' })
    create(@Request() req, @Body() createEconomieDto: CreateEconomieDto) {
        return this.economieService.create(req.user.id, createEconomieDto);
    }

    @Get('objectif/:objectifId')
    @ApiOperation({ summary: 'Récupérer toutes les économies d\'un objectif' })
    @ApiParam({ name: 'objectifId', type: Number, description: 'ID de l\'objectif' })
    @ApiResponse({ status: 200, description: 'Liste des économies de l\'objectif' })
    @ApiResponse({ status: 404, description: 'Objectif non trouvé' })
    @ApiResponse({ status: 400, description: 'Requête invalide' })
    findAllByObjectif(@Request() req, @Param('objectifId', ParseIntPipe) objectifId: number) {
        return this.economieService.findAllByObjectif(req.user.id, objectifId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Récupérer une économie par son ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID de l\'économie' })
    @ApiResponse({ status: 200, description: 'Économie trouvée' })
    @ApiResponse({ status: 404, description: 'Économie non trouvée' })
    @ApiResponse({ status: 400, description: 'Requête invalide' })
    findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.economieService.findOne(req.user.id, id);
    }

    @Patch(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID de l\'économie à modifier' })
    @ApiResponse({ status: 200, description: 'Économie mise à jour avec succès' })
    @ApiResponse({ status: 404, description: 'Économie non trouvée' })
    @ApiResponse({ status: 400, description: 'Requête invalide' })
    update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateEconomieDto: UpdateEconomieDto) {
        return this.economieService.update(req.user.id, id, updateEconomieDto);
    }

    @Delete(':id')
    @ApiParam({ name: 'id', type: Number, description: 'ID de l\'économie à supprimer' })
    @ApiResponse({ status: 200, description: 'Économie supprimée avec succès' })
    @ApiResponse({ status: 404, description: 'Économie non trouvée' })
    @ApiResponse({ status: 400, description: 'Requête invalide' })
    remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.economieService.remove(req.user.id, id);
    }
}