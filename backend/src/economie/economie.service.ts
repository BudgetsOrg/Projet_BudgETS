import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Economie } from '../entities/economie.entity';
import { Objectif } from '../entities/objectif.entity';
import { CreateEconomieDto } from './dto/create_economie.dto';
import { UpdateEconomieDto } from './dto/update_economie.dto';

@Injectable()
export class EconomieService {
    constructor(
        @InjectRepository(Economie)
        private economieRepository: Repository<Economie>,

        @InjectRepository(Objectif)
        private objectifRepository: Repository<Objectif>,
    ) {}
    
    async create(userId: number, createEconomieDto: CreateEconomieDto) {
        // Find the objectif and verify the user is one of its owners
        const objectif = await this.objectifRepository.findOne({
            where: { id_objectif: createEconomieDto.objectifId },
            relations: ['users'],
        });

        if (!objectif) {
            throw new NotFoundException('Objectif non trouvé');
        }

        const isOwner = objectif.users.some(user => user.id_user === userId);
        if (!isOwner) {
            throw new NotFoundException('Objectif non trouvé');
        }

        const { objectifId, ...rest } = createEconomieDto;

        const economie = this.economieRepository.create({
            ...rest,
            objectif: objectif,
        });
        await this.recalculerMontantEpargne(createEconomieDto.objectifId);
        return this.economieRepository.save(economie);
    }

    async findAllByObjectif(userId: number, objectifId: number) {
        const objectif = await this.objectifRepository.findOne({
            where: { id_objectif: objectifId },
            relations: ['users', 'economies'],
        });

        if (!objectif) {
            throw new NotFoundException('Objectif non trouvé');
        }

        const isOwner = objectif.users.some(user => user.id_user === userId);
        if (!isOwner) {
            throw new NotFoundException('Objectif non trouvé');
        }

        return objectif.economies;
    }

    async findOne(userId: number, id: number) {
        const economie = await this.economieRepository.findOne({
            where: { id_economie: id },
            relations: ['objectif', 'objectif.users'],
        });

        if (!economie) {
            throw new NotFoundException('Économie non trouvée');
        }

        const isOwner = economie.objectif.users.some(user => user.id_user === userId);
        if (!isOwner) {
            throw new NotFoundException('Économie non trouvée');
        }

        return economie;
    }

    async update(userId: number, id: number, updateEconomieDto: UpdateEconomieDto) {
        const economie = await this.findOne(userId, id);

        economie.montant = updateEconomieDto.montant ?? economie.montant;
        if (updateEconomieDto.date) {
            economie.date = new Date(updateEconomieDto.date);
        }
        return this.economieRepository.save(economie);
    }

    async remove(userId: number, id: number) {
        const economie = await this.findOne(userId, id);
        const objectifId = economie.objectif.id_objectif;
        await this.economieRepository.remove(economie);
        await this.recalculerMontantEpargne(objectifId);
        return { message: 'Économie supprimée avec succès' };
    }

    private async recalculerMontantEpargne(objectifId: number) {
    const objectif = await this.objectifRepository.findOne({
        where: { id_objectif: objectifId },
        relations: ['economies'],
    });
    if (!objectif) {
        throw new NotFoundException('Objectif non trouvé');
    }
    objectif.montant_epargne = objectif.economies.reduce(
        (sum, eco) => sum + Number(eco.montant), 0
    );
    await this.objectifRepository.save(objectif);
    }
}