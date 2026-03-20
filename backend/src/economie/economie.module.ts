import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Economie } from "src/entities";
import { EconomieService } from "./economie.service";
import { EconomieController } from "./economie.controller";



@Module({
    imports:[TypeOrmModule.forFeature([Economie])],
    controllers:[EconomieController],
    providers:[EconomieService]
})
export class EconomieModule{}