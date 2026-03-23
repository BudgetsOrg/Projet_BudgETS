import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { InscriptionDto } from "./dto";



@Controller('auth')
export class AuthController{
    constructor(private  authService: AuthService){}

    @Post('inscription')
    inscription(@Body() dto: InscriptionDto) {
    // On utilise le service qu'on a "injecté" dans le constructeur
    return this.authService.inscription(dto); 
    }

}