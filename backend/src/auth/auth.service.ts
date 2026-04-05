import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { ConnexionDto, InscriptionDto, ResetPasswordDto } from './dto';
import * as argon from 'argon2';

//bibliothèque officielle de NestJS pour gérer les JSON Web Tokens (JWT).
//npm i --save @nestjs/jwt installer

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async inscription(dto: InscriptionDto) {
    try {
      ///genere un  mot de passe hashed
      const hash = await argon.hash(dto.password);

      // Cree une instance d'un user
      const user = await this.userService.create({
        nom: dto.nom,
        prenom: dto.prenom,
        adresse_email: dto.adresse_email,
        password: hash,
        date_naissance: dto.date_naissance,
        telephone: dto.telephone,
        image: dto.image,
        soldeDumois: dto.soldeDumois,
      });

      //returne token
      return this.signToken(user.id_user, user.adresse_email);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ForbiddenException('Identifiants déjà utilisés');
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
  async signToken(
    userID: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userID, email };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token: token,
    };

    // return this.jwtService.signAsync(payload, {
    //   expiresIn: '1h',
    //   secret: 'secret',
    // });
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    // Ne pas dire si l'email n'existe pas
    if (!user)
      return { message: 'Si ce compte existe, un email a été envoyé.' };

    // Générer un token temporaire (expire en 15 min)
    const payload = { sub: user.id_user, type: 'reset' };
    const resetToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });

    // Envoyer via Resend
    await this.mailService.sendResetPasswordEmail(
      user.adresse_email,
      resetToken,
    );

    return { message: 'Email de récupération envoyé.' };
  }

  // Dans auth.service.ts

async resetPassword(dto: ResetPasswordDto) {
    try {
        // Vérifier et décoder le token (on vérifie s'il n'est pas expiré)
        const payload = await this.jwtService.verifyAsync(dto.token, {
            secret: process.env.JWT_SECRET,
        });

        // Extraire l'ID de l'utilisateur (le 'sub' qu'on a mis dedans lors du forgotPassword)
        const userId = payload.sub;

        // Hasher le nouveau mot de passe
        const newHash = await argon.hash(dto.password);

        // Demander au UserService de mettre à jour en DB
        await this.userService.updatePassword(userId, newHash);

        return { message: "Mot de passe modifié avec succès !" };
    } catch (error) {
        // Si le token est expiré ou corrompu, NestJS lancera une erreur
        throw new ForbiddenException("Lien invalide ou expiré.");
    }
  }
}
