import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    // On garde l'initialisation, mais on ne l'utilisera pas en test
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_fake_key');
  }

  async sendResetPasswordEmail(email: string, token: string) {
    // --- MODE SIMULATION ---
    // console.log('--- SIMULATION D’ENVOI D’EMAIL ---');
    // console.log(`Destinataire : ${email}`);
    // console.log(`Token généré  : ${token}`);
    // console.log(`Lien de reset : http://localhost:3000/auth/reset-password?token=${token}`);
    // console.log('---------------------------------');

    // On commente la partie réelle pour ne pas appeler l'API Resend
    
    await this.resend.emails.send({
      from: 'BudgETS <onboarding@resend.dev>',
      to: email,
      subject: 'Réinitialisation',
      html: `<p>Cliquez ici pour changer votre mot de passe :</p>
            <a href="http://localhost:3000/auth/reset-password?token=${token}"> Réinitialiser </a>`,
    });
    

    return { success: true, message: 'Email envoyé avec succès' };
  } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      throw new InternalServerErrorException("Impossible d'envoyer l'email de récupération.");
    }
}