import { Controller } from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport/dist/auth.guard";

@UseGuards(AuthGuard('jwt'))
@Controller('economie')
export class EconomieController{
    
}