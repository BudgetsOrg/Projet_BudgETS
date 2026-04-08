import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { JwtStrategy } from "./stategy/jwt.strategy";
import { MailModule } from "src/mail/mail.module";



@Module({
  imports: [
    UserModule,
    MailModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController], 
  providers: [AuthService, JwtStrategy],
  
})

export class AuthModule {}