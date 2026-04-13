import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Objectif, User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ObjectifRepository {
  constructor(
    @InjectRepository(Objectif)
    private readonly repo: Repository<Objectif>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  //Create
  async create(
    montant: number,
    titre: string,
    image: string,
    userID: number,
  ): Promise<Objectif> {
    const newObjectif = this.repo.create({
      montant: montant,
      titre: titre,
      image: image,
      users: [{ id_user: userID }], //tableau car il peut avoir un ou plusieurs proprietaire de l'objectif
    }); // .create() prépare l'entité
    return await this.repo.save(newObjectif);
  }

  //Read all : by user dans ce cas
  async getAll(userId: number): Promise<Objectif[]> {
    return await this.repo.find({
        where: { users: { id_user: userId } },
        relations: ['economies', 'users'], 
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
      relations: ['users', 'economies'], //pour avoir les membres
    });
  }

  //UPDATE
  async update(
    userId: number,
    objectifId: number,
    data: Partial<Objectif>,
  ): Promise<Objectif | null> {
    const objectif = await this.getOne(userId, objectifId);
    if (!objectif) {
      return null;
    }
    const updatedObjectif = this.repo.merge(objectif, data);

    return await this.repo.save(updatedObjectif);
  }

  //ajout d'une personne par email

  async addMemberByEmail(objectifId: number, email: string): Promise<Objectif> {
    // Trouver l'objectif avec ses membres actuels
    const objectif = await this.repo.findOne({
      where: { id_objectif: objectifId },
      relations: ['users'],
    });

    if (!objectif) throw new NotFoundException('Objectif introuvable');

    // Trouver le futur membre (tu auras besoin d'injecter UserRepository ou d'utiliser le QueryRunner)
    // Ici on assume que tu as accès à la table User
    const userToAdd = await this.userRepo.findOneBy({ adresse_email: email });

    if (!userToAdd)
      throw new NotFoundException('Utilisateur non trouvé avec cet email');

    // Vérifier s'il est déjà membre pour éviter les doublons
    const isAlreadyMember = objectif.users.some(
      (u) => u.id_user === userToAdd.id_user,
    );

    if (!isAlreadyMember) {
      objectif.users.push(userToAdd);
      return await this.repo.save(objectif);
    }

    return objectif;
  }

  //DELETE
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
      // S'il n'y a plus personne, on supprime l'objectif
      await this.repo.remove(objectif);
    } else {
      // S'il reste du monde (objectif commun), on sauvegarde juste la nouvelle liste
      await this.repo.save(objectif);
    }
  }
}
