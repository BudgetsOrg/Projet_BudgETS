import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConnexionDto, InscriptionDto, ForgotPasswordDto, ResetPasswordDto } from './dto';

@ApiResponse({ status: 400, description: "Requête invalide" })
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
  @ApiResponse({ status: 201, description: 'Inscription réussie' })
  @ApiResponse({ status: 403, description: "Identifiants déjà utilisés" })
  @ApiResponse({ status: 409, description: "Cet email est déjà utilisé" })
  @Post('inscription')
  inscription(@Body() dto: InscriptionDto) {
    // on utilise le service qu'on 'injecte' dans le contructeur
    return this.authService.inscription(dto);
  }

  @ApiOperation({ summary: 'Connexion d\'un utilisateur existant' })
  @ApiResponse({ status: 200, description: 'Connexion réussie' })
  @ApiResponse({ status: 403, description: "Identifiants incorrects"})
  @HttpCode(HttpStatus.OK)
  @Post('connexion')
  signin(@Body() dto: ConnexionDto) {
    return this.authService.connexion(dto);
  }

  @ApiOperation({ summary: 'Demande de mot de passe oublié à travers un courriel' })
  @ApiResponse({ status: 201, description: 'Si message = "Email de récupération envoyé" alors la demande est traitée avec succès \n Si message = "Si ce compte existe, un email a été envoyé" alors le compte n\'existe pas, mais le code statut est 200 pour evité de dévoiler si un compte existe.' })
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.adresse_email);
  }

  @ApiOperation({ summary: 'Réinitialisation du mot de passe en utilisant le token envoyé par courriel' })
  @ApiResponse({ status: 200, description: 'Réinitialisation du mot de passe réussie' })
  @ApiResponse({ status: 403, description: "Lien invalide ou expiré." })
  @Post('reset-password') 
  resetPassword(@Body() dto: ResetPasswordDto) {
  return this.authService.resetPassword(dto);
  }
}
