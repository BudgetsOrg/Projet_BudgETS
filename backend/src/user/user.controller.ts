import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, UseGuards,Request } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';

@ApiBearerAuth() // Indique que les routes de ce contrôleur nécessitent une authentification par token Bearer (JWT) pour Swagger
@Controller('users')
@ApiResponse({ status: 401, description: 'Unauthorized' })
export class UserController {
    // Passe le service dans le controller pour pouvoir l'utiliser dans les méthodes du controller en mode readonly pour prevenir les modifications accidentelles.
    // il faut toujours que ça pointe vers une instance de UserService pour que les méthodes du service soient accessibles dans le controller.
    constructor(private readonly userService: UserService) {} 
    
    // Gere les requetes HTTP DELETE sur le chemin users/id, parseintpipe convertit le paramètre id de string à number,
    // puis appelle la méthode delete du service pour supprimer le user correspondant à l'id fourni.
    // @Delete(':id')
    // delete(@Param('id', ParseIntPipe) id: number) {
    //     return this.userService.delete(id);
    // }
    
    @Delete('me')
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: 200, description: 'Compte supprimé avec succès' })
    async deleteMyAccount(@Request() req) {
    return this.userService.delete(req.user.id);
    }

    @UseGuards(AuthGuard('jwt')) // C'est ce verrou qui teste ton token
    @ApiResponse({ status: 200, description: 'Profil récupéré avec succès' })
    @Get('me')
    getProfile(@Request() req) {
        return req.user; // Retourne les infos de l'utilisateur extraites du token
    }

}