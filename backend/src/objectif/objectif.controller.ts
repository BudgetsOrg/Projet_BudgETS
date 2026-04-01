import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ObjectifDto } from './dto/objectif.dto';
import { AuthGuard } from '@nestjs/passport';
import { ObjectifRepository } from 'src/repositories';


@Controller('objectif')
export class ObjectifController {

    constructor( private readonly objectifService: ObjectifRepository) {};

    // Get('all-objectifs')
    // getAll{

    // }

    @UseGuards(AuthGuard('jwt')) // protège la route : seul un user connecté peut créer
    @Post()
    async create(@Body() dto: ObjectifDto, @Req() req: any) {
        // Grace a JwtStrategy, 'req.user' contient l'utilisateur trouvé en DB
        const userId = req.user.id_user; 
        
        // On appelle ton service avec les données du DTO et l'ID du user
        return this.objectifService.create(dto.montant, dto.titre, userId);
    }

}
