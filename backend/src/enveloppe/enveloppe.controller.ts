import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { EnveloppeService } from "./enveloppe.service";
import { UpdateEnveloppeDto } from "./dto/update_enveloppe.dto";
import { JwtAuthGuard } from "../auth/guard/jwt.guard";
import { Request } from "@nestjs/common";
import { CreateEnveloppeDto } from "./dto/create_enveloppe.dto";
import { AuthGuard } from "@nestjs/passport/dist/auth.guard";

@UseGuards(AuthGuard('jwt'))
@Controller('enveloppe')
export class EnveloppeController{
    
    constructor(private readonly enveloppeService: EnveloppeService) {}

    @Post()
    create(@Request() request, @Body() createEnveloppeDto: CreateEnveloppeDto) {
        return this.enveloppeService.create(request.user.id, createEnveloppeDto);
    }

    // Récupérer toutes les enveloppes
    @Get()
    findAll(@Request() request) {
        return this.enveloppeService.findAll(request.user.id);
    }

    @Patch(':id')
    update(@Request() request, @Body() updateEnveloppeDto: UpdateEnveloppeDto, @Param('id', ParseIntPipe) id: number) {
        return this.enveloppeService.update(request.user.id, updateEnveloppeDto, id);
    }

    @Get(':id')
    findOne(@Request() request, @Param('id', ParseIntPipe) id: number) {
        return this.enveloppeService.findOne(request.user.id, id);
    }

    @Delete(':id')
    remove(@Request() request, @Param('id', ParseIntPipe) id: number) {
        return this.enveloppeService.remove(request.user.id, id);
    }
}