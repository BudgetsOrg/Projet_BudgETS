import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS, 
      },
    });
  }

  async sendResetPasswordEmail(email: string, token: string) {
    try {
      const mailOptions = {
        from: '"Support BudgETS" <' + process.env.GMAIL_USER + '>',
        to: email, // Ça va marcher pour n'importe qui maintenant !
        subject: 'Réinitialisation de mot de passe - BudgETS',
        html: `
          <h3>Besoin d'un nouveau mot de passe ?</h3>
          <p>Cliquez sur le lien ci-dessous pour le réinitialiser :</p>
          <a href="http://localhost:3000/auth/reset-password?token=${token}">Réinitialiser mon mot de passe</a>
          <p>Si vous n'avez pas demandé ce changement, ignorez ce message.</p>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email envoyé avec succès ! ID:', info.messageId);
      return { success: true };
    } catch (error) {
      console.error("Erreur SMTP :", error);
      throw new InternalServerErrorException("Erreur lors de l'envoi du courriel.");
    }
  }

  async sendInvitationEmail(targetEmail: string, inviterName: string, goalTitle: string) {
  const mailOptions = {
    from: `"BudgETS" <${process.env.GMAIL_USER}>`,
    to: targetEmail,
    subject: `Invitation à l'objectif : ${goalTitle}`,
    html: `
      <h3>Salut !</h3>
      <p><strong>${inviterName}</strong> t'a invité à collaborer sur l'objectif <strong>"${goalTitle}"</strong> dans BudgETS.</p>
      <p>Connecte-toi à l'application pour commencer à épargner ensemble !</p>
      <a href="http://localhost:3000">Ouvrir BudgETS</a>
    `,
  };
  return await this.transporter.sendMail(mailOptions);
  }
}