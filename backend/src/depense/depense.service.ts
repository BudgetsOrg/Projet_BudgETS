import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Depense } from '../entities/depense.entity';
import { Enveloppe } from '../entities/enveloppe.entity';
import { CreateDepenseDto } from './dto/create_depense.dto';
import { UpdateDepenseDto } from './dto/update_depense.dto';

@Injectable()
export class DepenseService {
    constructor(
        @InjectRepository(Depense)
        private depenseRepository: Repository<Depense>,

        @InjectRepository(Enveloppe)
        private enveloppeRepository: Repository<Enveloppe>,
    ) {}

    //
    async create(userId: number, createDepenseDto: CreateDepenseDto) {
    //trouve l'enveloppe associée à la dépense en vérifiant que l'enveloppe 
    //appartient à un budget qui appartient à l'utilisateur authentifié
    const enveloppe = await this.enveloppeRepository.findOne({
        where: {
            id_enveloppe: createDepenseDto.enveloppeId,
            budget: { user: { id_user: userId } },
        },
        relations: ['budget'],
    });

    if (!enveloppe) { //pour une reponse 404 - si l'enveloppe n'existe pas ou pas le bon user
        throw new NotFoundException('Enveloppe non trouvée');
    }

    //Enlève enveloppeId et categorieId du DTO et met le reste des champs dans rest
    const { enveloppeId, categorieId, ...rest } = createDepenseDto;

    //on utilisse ensuite rest pour creer la depense avec les champs du dto et 
    //on associe l'enveloppe trouvée et la catégorie si elle est fournie
    //enveloppe Id et categorier Id  ne pouvaient pas être inclus dans reste vu que TypeORM a 
    //besoin d'un objet relation mais ils sont seulement des IDs
    const depense = this.depenseRepository.create({
    ...rest,
    enveloppe: enveloppe,
    categorie: categorieId
        ? { id_categorie: categorieId }
        : undefined,
});

    return this.depenseRepository.save(depense);
}


    async findAllByEnveloppe(userId: number, enveloppeId: number) {
        const enveloppe = await this.enveloppeRepository.findOne({
            where: {
                id_enveloppe: enveloppeId,
                budget: { user: { id_user: userId } },
            },
            relations: ['budget'],
        });

        if (!enveloppe) {
            throw new NotFoundException('Enveloppe non trouvée');
        }

        return this.depenseRepository.find({
            where: { enveloppe: { id_enveloppe: enveloppeId } },
            relations: ['categorie'],
        });
    }

    async findOne(userId: number, id: number) {
        const depense = await this.depenseRepository.findOne({
            where: {
                id_depense: id,
                enveloppe: { budget: { user: { id_user: userId } } },
            },
            relations: ['enveloppe', 'categorie'],
        });

        if (!depense) {
            throw new NotFoundException('Dépense non trouvée');
        }

        return depense;
    }

    async update(userId: number, id: number, updateDepenseDto: UpdateDepenseDto) {
    const depense = await this.findOne(userId, id);
    
    //Pas utilisé ?? pour ctaégorie pcq on a juste l'id donc une catégorie partielle,
    // mais TypeORM a besoin d'un objet complet pour faire la relation
    if (updateDepenseDto.categorieId) {
        depense.categorie = { id_categorie: updateDepenseDto.categorieId } as any;
    }

    //?? permet de ne mettre à jour que les champs fournis dans le DTO, les autres restent inchangés
    depense.nom_depense = updateDepenseDto.nom_depense ?? depense.nom_depense;
    depense.montant = updateDepenseDto.montant ?? depense.montant;
    depense.date = updateDepenseDto.date ? new Date(updateDepenseDto.date) : depense.date;
    depense.recurrente = updateDepenseDto.recurrente ?? depense.recurrente;

    return this.depenseRepository.save(depense);
}

    async remove(userId: number, id: number) {
        const depense = await this.findOne(userId, id);
        await this.depenseRepository.remove(depense);
        return { message: 'Dépense supprimée avec succès' };
    }
}