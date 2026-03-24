import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { ConnexionDto, InscriptionDto } from "./dto";
import * as argon from 'argon2';

//bibliothèque officielle de NestJS pour gérer les JSON Web Tokens (JWT).
//npm i --save @nestjs/jwt installer


@Injectable()
export class AuthService{
    constructor(
    private readonly userService: UserService, 
    private readonly jwtService: JwtService
  ){}

     async inscription(dto:InscriptionDto) {
    try {
      ///genere un  mot de passe hashed
      const hash = await argon.hash(dto.password);

      // Cree une instance d'un user
      const user = await this.userService.create({
        nom: dto.nom,
        prenom: dto.prenom,
        adresse_email: dto.adresse_email,
        password: hash,
        date_naissance:new Date( dto.date_naissance),
      });
      

    //returne token
      return this.signToken(user.id_user, user.adresse_email);

    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        
        throw new ForbiddenException('Credentiel pris');
      }
      throw error; 
    }
  }

  async connexion(dto: ConnexionDto) {
    // findByEmail au lieu de findOne
    const user = await this.userService.findByEmail(dto.adresse_email);

    if (!user) {
        throw new ForbiddenException('Identifiants incorrects');
    }

    // Comparer le mot de passe en clair du DTO avec le hash de la DB
    const matches = await argon.verify(user.password, dto.password);

    if (!matches) {
        throw new ForbiddenException('Identifiants incorrects');
    }

    return this.signToken(user.id_user, user.adresse_email);

    }

    //le token
    async signToken(userID: number, email: string): Promise<{access_token:string}> {
    const payload = { sub:userID, email };
  

    const token = await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
        secret: process.env.JWT_SECRET,
      });
  
    return {
      access_token: token,
    }

    // return this.jwtService.signAsync(payload, {
    //   expiresIn: '1h',
    //   secret: 'secret',
    // });
  }
}