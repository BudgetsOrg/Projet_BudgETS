import { Injectable, InternalServerErrorException } from '@nestjs/common';
// @ts-ignore
import { BrevoClient } from '@getbrevo/brevo';

@Injectable()
export class MailService {
  private brevo: BrevoClient;

  constructor() {
    this.brevo = new BrevoClient({
      apiKey: process.env.BREVO_API_KEY as string,
    });
  }

  async sendResetPasswordEmail(email: string, token: string) {
    try {
      await this.brevo.transactionalEmails.sendTransacEmail({
        sender: { name: 'Support BudgETS', email: process.env.GMAIL_USER },
        to: [{ email }],
        subject: 'Réinitialisation de mot de passe - BudgETS',
        htmlContent: `
          <h3>Besoin d'un nouveau mot de passe ?</h3>
          <p>Cliquez sur le lien ci-dessous pour le réinitialiser :</p>
          <a href="http://localhost:5173/PageCreationNouveauMdp?token=${token}">Réinitialiser mon mot de passe</a>
          <p>Si vous n'avez pas demandé ce changement, ignorez ce message.</p>
        `,
      });
      console.log('Email envoyé avec succès !');
      return { success: true };
    } catch (error) {
      console.error('Erreur email:', error);
      throw new InternalServerErrorException("Erreur lors de l'envoi du courriel.");
    }
  }

  async sendInvitationEmail(targetEmail: string, inviterName: string, goalTitle: string) {
  try {
    await this.brevo.transactionalEmails.sendTransacEmail({
      sender: { name: 'BudgETS', email: process.env.GMAIL_USER },
      to: [{ email: targetEmail }],
      subject: `Invitation à l'objectif : ${goalTitle}`,
      htmlContent: `
        <h3>Salut !</h3>
        <p><strong>${inviterName}</strong> t'a invité à collaborer sur l'objectif <strong>"${goalTitle}"</strong> dans BudgETS.</p>
        <p>Connecte-toi à l'application pour commencer à épargner ensemble !</p>
        <a href="http://localhost:3000">Ouvrir BudgETS</a>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Erreur email invitation:', error);
    throw new InternalServerErrorException("Erreur lors de l'envoi de l'invitation.");
  }
}
}