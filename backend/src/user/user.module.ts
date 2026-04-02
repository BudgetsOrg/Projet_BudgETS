import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { UserRepository } from 'src/repositories/index';
import { BudgetModule } from 'src/budget/budget.module';
import { ObjectifModule } from 'src/objectif/objectif.module';

//utilisé pour partager le service et le controller avec les autres modules de l'application.
@Module({
  imports: [TypeOrmModule.forFeature([User]),BudgetModule,ObjectifModule ],
  controllers: [UserController], //servent a definir les routes donc https:// get post ou  put
  providers: [UserService, UserRepository ],
  exports: [UserService, UserRepository], //permet de partager le service avec les autres modules de l'application.
})
export class UserModule {}