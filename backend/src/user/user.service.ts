import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { User } from '../entities/user.entity';
import { BudgetRepository, UserRepository , ObjectifRepository} from 'src/repositories/index';
import { InscriptionDto } from 'src/auth/dto';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
      private readonly userRepository: UserRepository,
      private readonly budgetRepository: BudgetRepository,
      private readonly objectifRepository : ObjectifRepository
  ) {}

  //CHERCHER UN USER (READ)
  async findOne(id: number) {
    const user = await this.userRepository.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  //TU CHERCHE LE USER PUIS TU MODIFY UN DES CASE MODIFIABLE ( UPDATE )
  async update(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.get(userId);

    if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.userRepository.update(userId, updateUserDto);
  }

  //DELETE USER
  async delete(id: number) {
    await this.findOne(id);
    const objectifs = await this.objectifRepository.getAll(id);
    for (const obj of objectifs) {
    await this.objectifRepository.leaveOrDelete(obj.id_objectif, id);
    }
    await this.userRepository.delete(id);
    
    return { message: 'User deleted' };
  }

  //// methode utilitaire pour calculer l'age
  private calculAge(date_naissance: Date): number {
    const aujourdhui = new Date();
    const jourNaissance = new Date(date_naissance);

    //age theorique
    let age = aujourdhui.getFullYear() - jourNaissance.getFullYear();

    const mois = aujourdhui.getMonth() - jourNaissance.getMonth();

    if (
      mois < 0 ||
      (mois === 0 && aujourdhui.getDate() < jourNaissance.getDate())
    ) {
      age--;
    }
    return age;
  }

  // vallidation des champ
  private validationChamp(userData:InscriptionDto){
    if (!userData.nom) {
      throw new BadRequestException('Le nom est obligatoire.');
    }
    if (!userData.prenom) {
      throw new BadRequestException('Le prénom est obligatoire.');
    }
    if (!userData.adresse_email) {
      throw new BadRequestException("L'adresse email est obligatoire.");
    }
    if (!userData.password) {
      throw new InternalServerErrorException("Le mot de passe n'a pas été traité.");
    }
  }

  //CREATE UN USER
  async create(userData: InscriptionDto):Promise<User> {
    //verifier que tu as bel est bien un nom ,un prenom et un email
     this.validationChamp(userData)

    //  Vérification de l'âge
    if (userData.date_naissance) {
      const dateUser = new Date(userData.date_naissance);
      const age = this.calculAge(dateUser);
      if (age < 18) {
        throw new BadRequestException(
          'Désolé, tu dois avoir 18 ans pour utiliser budgETS.',
        );
      }
    }
    //verifie que il y a bel est bein un email
    if (!userData.adresse_email) {
      throw new BadRequestException("L'email est obligatoire.");
    }

    // Verification si l'email existe déjà
    const existingUser = await this.userRepository.findByEmail(
      userData.adresse_email,
    );
    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé.');
    }
    if (!userData.date_naissance) {
      throw new BadRequestException("La date de naissance est obligatoire.");
    }
    const newUser = await this.userRepository.create(userData);
    await this.budgetRepository.create(userData.soldeDumois, newUser);
    // Création
    return newUser;
  }

  async updatePassword(id: number, hash: string) {
    return await this.userRepository.update(id, { password: hash });
}

  async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }
}
