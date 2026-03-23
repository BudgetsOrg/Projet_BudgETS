import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) 
    /*@InjectRepository(User) call pour le repository du user (un classe préparée avec des méthodes deja définies)
    donne un nom pour le pointer local vers le repository + declare qu'il utilise des objets de types user.*/
    private userRepository: Repository<User>, 
  ) {}

  //Trouve le user par son id, si il n'existe pas, throw une exception, puis retourne le user trouvé.
  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id_user: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  
  //Supprime le user trouvé par son id, puis retourne un message de confirmation.
  async delete(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { message: 'User deleted' };
  }

  //// methode utilitaire pour calculer l'age
  private calculAge(date_naissance: Date): number {
    const aujourdhui = new Date()
    const jourNaissance = new Date (date_naissance);

    //age theorique
    let age= aujourdhui.getFullYear() - jourNaissance.getFullYear();
    
    const mois= aujourdhui.getMonth() - jourNaissance.getMonth();

    if (mois < 0 || (mois === 0 && aujourdhui.getDate() < jourNaissance.getDate())) {
      age--;
    }
    return age;
  }

  async create(userData: Partial<User>) {
    //  Vérification de l'âge
    if (userData.date_naissance) {
      const age = this.calculAge(userData.date_naissance);
      if (age < 18) {
        throw new BadRequestException("Désolé, tu dois avoir 18 ans pour utiliser budgETS.");
      }
    }

    // Vérification si l'email existe déjà
    const existingUser = await this.userRepository.findOne({ 
      where: { adresse_email: userData.adresse_email } 
    });
    if (existingUser) {
      throw new ConflictException("Cet email est déjà utilisé.");
    }

    // Création et sauvegarde
    const newUser = this.userRepository.create(userData);
    return await this.userRepository.save(newUser);
  }

  async findByEmail(email: string) {
  return await this.userRepository.findOne({ 
    where: { adresse_email: email } 
  });
}
   
}