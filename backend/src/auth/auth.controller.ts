import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConnexionDto, InscriptionDto, ForgotPasswordDto, ResetPasswordDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 200, description: 'Inscription réussie' })
  @ApiResponse({ status: 401, description: "Identifiants déjà utilisés" })
  @Post('inscription')
  inscription(@Body() dto: InscriptionDto) {
    // on utilise le service qu'on 'injecte' dans le contructeur
    return this.authService.inscription(dto);
  }

  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiResponse({ status: 401, description: "Identifiants incorrects"})
  @HttpCode(HttpStatus.OK)
  @Post('connexion')
  signin(@Body() dto: ConnexionDto) {
    return this.authService.connexion(dto);
  }

  @ApiResponse({ status: 200, description: 'Demande de mot de passe oubliée traitée avec succès' })
  @ApiResponse({ status: 400, description: "Impossible d\'envoyer l\'email de récupération." })
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.adresse_email);
  }
  @ApiResponse({ status: 200, description: 'Réinitialisation du mot de passe réussie' })
  @ApiResponse({ status: 400, description: "Lien invalide ou expiré." })
  @Post('reset-password') 
  resetPassword(@Body() dto: ResetPasswordDto) {
  return this.authService.resetPassword(dto);
  }
}
