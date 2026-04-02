import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categorie } from '../entities/categorie.entity';
import { CreateCategorieDto } from './dto/create_categorie.dto';
import { UpdateCategorieDto } from './dto/update_categorie.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CategorieService {
    constructor(
        @InjectRepository(Categorie)
        private categorieRepository: Repository<Categorie>,
    ) {}

    async create(userId: number, createCategorieDto: CreateCategorieDto) {
    const categorie = this.categorieRepository.create({
        nom_categorie: createCategorieDto.nom_categorie,
        userId: userId,
    });
    return this.categorieRepository.save(categorie);
    }

    async findAll(userId: number) {
        return this.categorieRepository.find({
            where: { userId: userId },
        });
    }

    async findOne(userId: number, id: number) {
        const categorie = await this.categorieRepository.findOne({
            where: { id_categorie: id, userId: userId },
        });

        if (!categorie) {
            throw new NotFoundException('Catégorie non trouvée');
        }

        return categorie;
    }

    async update(userId: number, id: number, updateCategorieDto: UpdateCategorieDto) {
        const categorie = await this.findOne(userId, id);
        Object.assign(categorie, updateCategorieDto);
        return this.categorieRepository.save(categorie);
    }

    async remove(userId: number, id: number) {
        const categorie = await this.findOne(userId, id);
        await this.categorieRepository.remove(categorie);
        return { message: 'Catégorie supprimée avec succès' };
    }
}