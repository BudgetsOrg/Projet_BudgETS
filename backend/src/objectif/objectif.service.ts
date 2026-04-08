import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Objectif } from 'src/entities';
import { ObjectifDto } from './dto/objectif.dto';
import { ObjectifRepository } from 'src/repositories';

@Injectable()
export class ObjectifService {
  constructor(
    private readonly objectifRepo: ObjectifRepository,
  ) {}

  //Méthode pour :Create un objectif
  async create(dto: ObjectifDto, userId: number): Promise<Objectif> {
    return this.objectifRepo.create(dto.montant, dto.titre, userId);
  }

  //Methode pour :lire tout les objectifs d'un utilisateur
  async findAll(userId: number): Promise<Objectif[]> {
    return await this.objectifRepo.getAll(userId);
  }

  //Methode pour :lire un objectif
  async findOne(userId: number, objectifId: number) {
    const reponse = await this.objectifRepo.getOne(userId, objectifId);
    if (!reponse) throw new NotFoundException("Objectif introuvable");
    return reponse;
}

  //Méthode pour :Update la somme, le nom ou l'image de l'objectif
  async update(
    userId: number,
    objectifId: number,
    dto: Partial<ObjectifDto>,
  ): Promise<Objectif> {
    const result = await this.objectifRepo.update(userId, objectifId, dto);

    if (!result) {
      throw new NotFoundException(
        'Mise à jour impossible : objectif introuvable.',
      );
    }

    return result;
  }

  //Methode pour :Delete un objectif

  async leaveOrDelete(objectifId: number, userId: number): Promise<void> {
    await this.objectifRepo.leaveOrDelete(objectifId , userId);
  }
}
