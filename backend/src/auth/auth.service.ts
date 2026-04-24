import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { ConnexionDto, ForgotPasswordDto, InscriptionDto, ResetPasswordDto } from './dto';
import * as argon from 'argon2';
import { error } from 'console';


@Injectable()
export class AuthService {
/**
 * @constructor: Prend en param les services necessaires (injection des dependences)
 */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

/**
 * @function inscription: Enregistre un nouvel utilisateur, hache son mot de passe 
 *                        et genere un token JWT.
 * @param dto Donnees d'inscription (InscriptionDto)
 * @returns Un objet contenant l'access_token
 * @throws ForbiddenException si l'adresse email est deja prise
 */
  async inscription(dto: InscriptionDto) {
    try {
      // Declare une variable qui hachure le mot de passe et le contient
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

      await this.userService.updateDerniereConnexion(user.id_user);
      // Returne token
      return this.signToken(user.id_user, user.adresse_email);

    } catch (error:any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ForbiddenException('Identifiants déjà utilisés');
      }
      throw error;
    }
  }
/**
 * @function connexion : Cherche le user avec son email, compare le mot de passe
 *                       et retourne un token
 * @param dto: Donner de connexion (connexionDto)
 * @returns : Un objet contenant le token  
 */

  async connexion(dto: ConnexionDto) {
    // findByEmail() au lieu de findOne
    const user = await this.userService.findByEmail(dto.adresse_email);

    if (!user) {
      throw new ForbiddenException('Identifiants incorrects');
    }

    const matches = await argon.verify(user.password, dto.password);

    if (!matches) {
      throw new ForbiddenException('Identifiants incorrects');
    }

    // Sauvegarder la dernière connexion avant de la mettre à jour
    const derniereConnexion = user.derniere_connexion;

    // Mettre à jour à maintenant
    await this.userService.updateDerniereConnexion(user.id_user);

    const token = await this.signToken(user.id_user, user.adresse_email);

    return {
      ...token,
      derniere_connexion: derniereConnexion,
    };
  }

  /**
   * L'objet qui returne un token 
   * @param userID 
   * @param email 
   * @returns : un access token avec une date d'expiration de 1 jour
   */
  async signToken(
    userID: number,
    email: string,
  ): Promise<{ access_token: string }> {

    //Payloas contient les donnees non sensibles que l'on veut encoder
    const payload = { sub: userID, email };

    //Token valide pendant 1 jour
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET,
    });

    return {
      access_token: token,
    };
  }

  /**
   * @function forgotPassword : Cherche un user grace au email 
   * @param email
   * @returns message
   */

  async forgotPassword(dto:ForgotPasswordDto) {

    // Chercher le user par email
    const user = await this.userService.findByEmail(dto.adresse_email);

    // Ne pas dire si l'email n'existe pas
    if (!user)
      return { message: 'Si ce compte existe, un email a été envoyé.' };

    // Generer un token temporaire (expire en 15 min)
    const payload = { sub: user.id_user, type: 'reset' };
    const resetToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: process.env.JWT_SECRET,
    });

    // Envoyer via Gmail
    await this.mailService.sendResetPasswordEmail(
      user.adresse_email,
      resetToken,
    );

    return { message: 'Email de récupération envoyé.' };
  }


  async resetPassword(dto: ResetPasswordDto) {
    try {
        // S'assurer que le token n'est pas expirer
        const payload = await this.jwtService.verifyAsync(dto.token, {
            secret: process.env.JWT_SECRET,
        });

        // Extraire l'ID de l'utilisateur 
        const userId = payload.sub;

        // Hasher le nouveau mot de passe
        const newHash = await argon.hash(dto.password);

        // Demander au UserService de mettre a jour en DB
        await this.userService.updatePassword(userId, newHash);

        return { message: "Mot de passe modifié avec succès !" };
    } catch (error) {
        // Si le token est expire ou corrompu = message d'erreur
        throw new ForbiddenException("Lien invalide ou expiré.");
    }
  }
}
