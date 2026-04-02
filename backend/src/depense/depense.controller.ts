import { Controller, Get, Post, Patch, Delete, Param, Body, Request, ParseIntPipe, UseGuards } from '@nestjs/common';
import { DepenseService } from './depense.service';
import { CreateDepenseDto } from './dto/create_depense.dto';
import { UpdateDepenseDto } from './dto/update_depense.dto';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

@UseGuards(AuthGuard('jwt'))
@Controller('depense')
export class DepenseController {
    constructor(private readonly depenseService: DepenseService) {}

    //Permet de créer une dépense en utilisant les données fournies par le DTO et l'id du user obtenu du JWT
    @Post()
    create(@Request() req, @Body() createDepenseDto: CreateDepenseDto) {
        return this.depenseService.create(req.user.id, createDepenseDto);
    }

    //Permet de récupérer toutes les dépenses associées à une enveloppe spécifique pour l'utilisateur connecté
    @Get('enveloppe/:enveloppeId')
    findAllByEnveloppe(@Request() req, @Param('enveloppeId', ParseIntPipe) enveloppeId: number) {
        return this.depenseService.findAllByEnveloppe(req.user.id, enveloppeId);
    }

    //Permet de récupérer une dépense spécifique pour l'utilisateur connecté
    @Get(':id')
    findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.depenseService.findOne(req.user.id, id);
    }

    //Permet de mettre à jour une dépense spécifique pour l'utilisateur connecté en utilisant les données fournies par le DTO
    @Patch(':id')
    update(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() updateDepenseDto: UpdateDepenseDto) {
        return this.depenseService.update(req.user.id, id, updateDepenseDto);
    }

    //Permet de supprimer une dépense spécifique pour l'utilisateur connecté
    @Delete(':id')
    remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
        return this.depenseService.remove(req.user.id, id);
    }
}