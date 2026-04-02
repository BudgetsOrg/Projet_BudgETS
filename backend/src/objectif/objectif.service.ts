import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Objectif } from 'src/entities';
import { Repository } from 'typeorm';
import { ObjectifDto } from './dto/objectif.dto';
import { ObjectifRepository } from 'src/repositories';

@Injectable()
export class ObjectifService {
  constructor(
    @InjectRepository(Objectif)
    private objectifRepo: ObjectifRepository,
  ) {}

  //Méthode pour :Create un objectif
  async create(dto: ObjectifDto, userId: number): Promise<Objectif> {
    return this.objectifRepo.create(dto.montant, dto.titre, userId);
  }

  //Methode pour :lire tout les objectifs d'un utilisateur
  async findAll(userId:number):Promise<Objectif[]>{
    return await this.objectifRepo.getAll(userId)
  }

  //Methode pour :lire un objectif
  

  //Méthode pour :Update la somme de l'objectif

  //Methode pour :Delete un objectif
}
