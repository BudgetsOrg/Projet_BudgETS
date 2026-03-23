import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/entities';
import { Repository } from 'typeorm';

type userResponse = {
  id: number;
  name: string;
  email: string;
  password: string;
} | null;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.userRepository.findOne({
      where: { adresse_email: payload.email },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    // delete user.password;
    return user;
  }
}