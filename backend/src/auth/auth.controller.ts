import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConnexionDto, InscriptionDto, ForgotPasswordDto, ResetPasswordDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('inscription')
  inscription(@Body() dto: InscriptionDto) {
    // on utilise le service qu'on 'injecte' dans le contructeur
    return this.authService.inscription(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('connexion')
  signin(@Body() dto: ConnexionDto) {
    return this.authService.connexion(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.adresse_email);
  }
  @Post('reset-password') 
  resetPassword(@Body() dto: ResetPasswordDto) {
  return this.authService.resetPassword(dto);
  }
}
