import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Economie, Objectif } from "src/entities";
import { EconomieService } from "./economie.service";
import { EconomieController } from "./economie.controller";



@Module({
    imports: [TypeOrmModule.forFeature([Economie, Objectif])],
    controllers: [EconomieController],
    providers: [EconomieService],
})
export class EconomieModule {}