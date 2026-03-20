import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Budget } from "src/entities";



@Module({
    imports: [TypeOrmModule.forFeature([Budget])],
    controllers:[],
    providers:[],
})
export class BudggetModule{};