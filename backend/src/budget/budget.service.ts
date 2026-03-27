import { Injectable } from "@nestjs/common";
import { BudgetRepository } from "src/repositories";


@Injectable()
export class BudgetService{
    constructor(private readonly budgetRepo: BudgetRepository) {}
}