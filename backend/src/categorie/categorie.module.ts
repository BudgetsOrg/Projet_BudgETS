import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Categorie } from "src/entities";
import { CategorieController } from "./categorie.controller";
import { CategorieService } from "./categorie.service";


////// module de categorie ////
@Module({
    imports: [TypeOrmModule.forFeature([Categorie])],
    controllers:[CategorieController],
    providers:[CategorieService],
})
export class CategorieModule{}