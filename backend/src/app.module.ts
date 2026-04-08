import { Module } from '@nestjs/common';
import * as dotenv from 'dotenv';

import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Enveloppe,
  Objectif,
  Depense,
  Categorie,
  User,
  Budget,
  Economie,
} from './entities';
import { ObjectifModule } from './objectif/objectif.module';
import { EnveloppeModule } from './enveloppe/enveloppe.module';
import { EconomieModule } from './economie/economie.module';
import { DepenseModule } from './depense/depense.module';
import { BudgetModule } from './budget/budget.module';
import { CategorieModule } from './categorie/categorie.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      //on  va ecrire manuellement les entites mais si on voudrais que les entites soient
      // ecrit automatiquement alors autoLoadEntities: true
      entities: [
        Objectif,
        Enveloppe,
        Depense,
        Budget,
        Categorie,
        User,
        Economie,
      ], //declarer ici les entite
      synchronize: true,
    }),
    //declarer ici les modules
    AuthModule,
    ObjectifModule, 
    EnveloppeModule,
    EconomieModule,
    DepenseModule,
    BudgetModule,
    CategorieModule,
    UserModule,
    MailModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
