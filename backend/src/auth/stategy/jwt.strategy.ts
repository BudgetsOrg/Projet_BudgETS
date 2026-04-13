import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/repositories/index';

type userResponse = {
  id: number;
  name: string;
  email: string;
  password: string;
} | null;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.userRepository.findByEmail(
      payload.email ,
    );

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    return {
      id: user.id_user,// controller pourra faire req.user.id
      email: user.adresse_email,
      nom: user.nom,
      prenom: user.prenom
    };
  }
}