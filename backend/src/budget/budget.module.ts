import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Budget } from "src/entities";
import { BudgetService } from "./budget.service";
import { BudgetController } from "./budget.controller";



@Module({
    imports: [TypeOrmModule.forFeature([Budget])],
    controllers:[BudgetController],
    providers:[BudgetService],
})
export class BudgetModule{};