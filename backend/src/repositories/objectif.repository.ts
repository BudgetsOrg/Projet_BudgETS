import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Objectif } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ObjectifRepository {
  constructor(
    @InjectRepository(Objectif)
    private readonly repo: Repository<Objectif>,
  ) {}

  //Create
  async create(
    montant: number,
    titre: string,
    userID: number,
  ): Promise<Objectif> {
    const newObjectif = this.repo.create({
      montant: montant,
      titre: titre,
      users: [{ id_user: userID }], //tableau car il peut avoir un ou plusieurs proprietaire de l'objectif
    }); // .create() prépare l'entité
    return await this.repo.save(newObjectif);
  }

  //Read all : by user dans ce cas
  async getAll(userId: number): Promise<Objectif[]> {
    return await this.repo.find({
      where: {
        users: {
          id_user: userId,
        },
      },
    });
  }

  //read one
  async getOne(userId: number, objectifId: number): Promise<Objectif | null> {
    return await this.repo.findOne({
      where: {
        id_objectif: objectifId,
        users: {
          id_user: userId,
        },
      },
      relations: ['users'], //pour avoir les membres
    });
  }

  //update
  async update(userId:number, objectifId:number, data: Partial<Objectif>):Promise<Objectif|null>{
    const objectif = await this.getOne(userId,objectifId);
    if(!objectif){
      return null;
    }
    const updatedObjectif = this.repo.merge(objectif, data);

    return await this.repo.save(updatedObjectif);
  }

  //delete
  async leaveOrDelete(objectifId: number, userId: number): Promise<void> {
    //recupere objectif avec ses users
    const objectif = await this.repo.findOne({
      where: { id_objectif: objectifId },
      relations: ['users'],
    });

    if (!objectif) return;

    // on retire l'utilisateur de la liste
    objectif.users = objectif.users.filter((user) => user.id_user !== userId);

    // LOGIQUE ANTI-ORPHELIN
    if (objectif.users.length === 0) {
      // S'il n'y a plus personne, on supprime l'objectif carrément
      await this.repo.remove(objectif);
    } else {
      // S'il reste du monde (objectif commun), on sauvegarde juste la nouvelle liste
      await this.repo.save(objectif);
    }
  }

}
