import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiParam } from '@nestjs/swagger';
import { EnveloppeService } from "./enveloppe.service";
import { UpdateEnveloppeDto } from "./dto/update_enveloppe.dto";
import { JwtAuthGuard } from "../auth/guard/jwt.guard";
import { Request } from "@nestjs/common";
import { CreateEnveloppeDto } from "./dto/create_enveloppe.dto";
import { AuthGuard } from "@nestjs/passport/dist/auth.guard";
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';

@ApiBearerAuth() // Indique que les routes de ce contrôleur nécessitent une authentification par token Bearer (JWT) pour Swagger
@UseGuards(AuthGuard('jwt'))
@ApiResponse({ status: 401, description: 'Unauthorized' })
@Controller('enveloppe')
export class EnveloppeController{
    
    constructor(private readonly enveloppeService: EnveloppeService) {}

    @ApiResponse({ status: 200, description: 'Enveloppe créée avec succès' })
    @ApiResponse({ status: 400, description: "{ message: 'Pas la bonne requête pour créer l’enveloppe / Dépasse le budget' }" })
    @ApiResponse({ status: 404, description: "{ message: 'Budget non trouvé' }" })
    @Post()
    create(@Request() request, @Body() createEnveloppeDto: CreateEnveloppeDto) {
        return this.enveloppeService.create(request.user.id, createEnveloppeDto);
    }

    // Récupérer toutes les enveloppes
    @ApiResponse({ status: 200, description: 'Liste des enveloppes récupérée avec succès' })
    @ApiResponse({ status: 404, description: "{ message: 'Aucun budget trouvé pour cet utilisateur' }" })
    @Get()
    findAll(@Request() request) {
        return this.enveloppeService.findAll(request.user.id);
    }

    @ApiResponse({ status: 200, description: 'Enveloppe mise à jour avec succès' })
    @ApiResponse({ status: 404, description: "{ message: 'Enveloppe non trouvée' }" })
    @ApiResponse({ status: 400, description: "{ message: 'Pas la bonne requête pour mettre à jour l’enveloppe / Dépasse le budget' }" })
    @ApiParam({ name: 'id', type: Number, example: 3, description: "L'id de l'enveloppe à mettre à jour" })
    @Patch(':id')
    update(@Request() request, @Body() updateEnveloppeDto: UpdateEnveloppeDto, @Param('id', ParseIntPipe) id: number) {
        return this.enveloppeService.update(request.user.id, updateEnveloppeDto, id);
    }

    @ApiResponse({ status: 200, description: 'Enveloppe récupérée avec succès' })
    @ApiResponse({ status: 404, description: "{ message: 'Enveloppe non trouvée' }" })
    @ApiResponse({ status: 400, description: "{ message: 'Pas la bonne requête pour récupérer/modifié l’enveloppe, ou bien Dépasse le budget' }" })
    @ApiParam({ name: 'id', type: Number, example: 3, description: "L'id de l'enveloppe à récupérer" })
    @Get(':id')
    findOne(@Request() request, @Param('id', ParseIntPipe) id: number) {
        return this.enveloppeService.findOne(request.user.id, id);
    }

    @ApiResponse({ status: 200, description: 'Enveloppe supprimée avec succès' })
    @ApiResponse({ status: 404, description: "{ message: 'Enveloppe non trouvée' }" })
    @ApiResponse({ status: 400, description: "{ message: 'Pas la bonne requête pour supprimer l’enveloppe' }" })
    @ApiParam({ name: 'id', type: Number, example: 3, description: "L'id de l'enveloppe à supprimer" })
    @Delete(':id')
    remove(@Request() request, @Param('id', ParseIntPipe) id: number) {
        return this.enveloppeService.remove(request.user.id, id);
    }
}