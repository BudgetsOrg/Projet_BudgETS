import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) //@InjectRepository(User) call pour le repository du user (un classe préparée avec des méthodes deja définies)
    //donne un nom pour le pointer local vers le repository + declare qu'il utilise des objets de types user.
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
}