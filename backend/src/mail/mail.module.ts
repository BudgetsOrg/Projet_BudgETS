import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}