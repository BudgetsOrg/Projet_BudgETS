import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    // Passe le service dans le controller pour pouvoir l'utiliser dans les méthodes du controller en mode readonly pour prevenir les modifications accidentelles.
    // il faut toujours que ça pointe vers une instance de UserService pour que les méthodes du service soient accessibles dans le controller.
    constructor(private readonly userService: UserService) {} 
    
    // Gere les requetes HTTP DELETE sur le chemin users/id, parseintpipe convertit le paramètre id de string à number,
    // puis appelle la méthode delete du service pour supprimer le user correspondant à l'id fourni.
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }
}