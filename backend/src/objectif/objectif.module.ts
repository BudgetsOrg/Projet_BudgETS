import { Module } from '@nestjs/common';
import { ObjectifController } from './objectif.controller';
import { ObjectifService } from './objectif.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Objectif, User } from 'src/entities';
import { ObjectifRepository, UserRepository } from 'src/repositories';
import { MailModule } from 'src/mail/mail.module';


@Module({
  imports: [TypeOrmModule.forFeature([Objectif, User]),MailModule],
  controllers: [ObjectifController], 
  providers: [ObjectifService, ObjectifRepository,UserRepository],
  exports: [ObjectifRepository],
})
export class ObjectifModule {}
