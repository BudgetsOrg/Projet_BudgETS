import { Controller, Get } from "@nestjs/common";
import { EnveloppeService } from "./enveloppe.service";


// @Controller(), NestJS comprend : "C'est une adresse (URL) que 
// mon app peut appeler
@Controller('enveloppe')
export class EnveloppeController{
    
    constructor(private readonly enveloppeService: EnveloppeService) {}

// Récupérer toutes les enveloppes
  @Get() // GET http://localhost:8090/enveloppe
    findAll() {
        return this.enveloppeService.getAll();
    }

}