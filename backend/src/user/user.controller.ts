import { Controller, Get, Delete, Body,  UseGuards,Request, Patch } from '@nestjs/common';
import {  ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';
import { UpdateUserDto } from './dto';


@ApiBearerAuth() // Indique que les routes de ce contrôleur nécessitent une authentification par token Bearer (JWT) pour Swagger
@Controller('users')
@ApiResponse({ status: 401, description: 'Non autorisé' })
export class UserController {
    constructor(private readonly userService: UserService) {} 
    
    // UPDATE USER 
    @Patch('me')
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: 200, description: 'Profil mis à jour avec succès' })
    @ApiResponse({ status: 400, description: 'Requête invalide' })
    @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
    updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
    }

    //DELETE USER
    @Delete('me')
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: 200, description: 'Compte supprimé avec succès' })
    @ApiResponse({ status: 400, description: 'Requête invalide' })
    async deleteMyAccount(@Request() req) {
    return this.userService.delete(req.user.id);
    }

    //READ USER
    @UseGuards(AuthGuard('jwt')) 
    @ApiResponse({ status: 200, description: 'Profil récupéré avec succès' })
    @Get('me')
    getProfile(@Request() req) {
       return this.userService.findOne(req.user.id);
    }

}