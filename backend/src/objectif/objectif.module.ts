
import { Module } from '@nestjs/common';
import { ObjectifController } from './objectif.controller';
import { ObjectifService } from './objectif.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Objectif } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Objectif])],
  controllers: [ObjectifController],//servent a definir les routes donc https:// get post ou  put
  providers: [ObjectifService],
})

export class ObjectifModule {}
