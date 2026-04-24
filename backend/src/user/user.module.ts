import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { UserRepository } from 'src/repositories/index';
import { BudgetModule } from 'src/budget/budget.module';
import { ObjectifModule } from 'src/objectif/objectif.module';


@Module({
  imports: [TypeOrmModule.forFeature([User]),BudgetModule,ObjectifModule ],
  controllers: [UserController], 
  providers: [UserService, UserRepository ],
  exports: [UserService, UserRepository], 
})
export class UserModule {}