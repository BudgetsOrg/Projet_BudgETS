import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Depense, Enveloppe } from "src/entities";
import { DepenseService } from "./depense.service";
import { DepenseController } from "./depense.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Depense, Enveloppe])],
    controllers: [DepenseController],
    providers:[DepenseService]
})
export class DepenseModule{}