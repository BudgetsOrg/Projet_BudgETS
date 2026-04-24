import { Injectable, InternalServerErrorException } from '@nestjs/common';
// @ts-ignore
import { BrevoClient } from '@getbrevo/brevo';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class MailService {
  private brevo: BrevoClient;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,){
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
                    <div style="background-color: #051914; padding: 40px 20px; font-family: Arial, sans-serif;">
                      <div style="margin: 0 auto; text-align: center;">
                        <h1 style="color: #AADD66; font-size: 28px; font-style: italic; margin-bottom: 30px;">BudgETS</h1>
                        <h2 style="color: #FCF6EB; font-size: 22px; font-weight: normal;">Besoin d'un nouveau mot de passe?</h2>
                        <p style="color: #FCF6EB; font-size: 16px; line-height: 1.5; margin: 20px 0;">
                          Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe:
                        </p>
                        <a href="https://budgets.up.railway.app/PageCreationNouveauMdp?token=${token}" 
                          style="display: inline-block; margin-top: 20px; padding: 14px 40px; 
                            background-color: #003527;
                            background: linear-gradient(to top, rgb(0,53,39), rgb(170,221,102));
                            color: #FCF6EB; font-size: 16px; text-decoration: none;
                            font-weight: bold; border-radius: 25px;">
                            Réinitialiser mon mot de passe
                        </a>
                        <p style="color: #FCF6EB; font-size: 14px; margin-top: 30px;">
                          Si vous n'avez pas demandé ce changement, ignorez ce message.
                        </p>
                        <p style="color: #AADD66; font-size: 12px; margin-top: 40px;">
                            © BudgETS -- À L'ÉTS on gere son budget avec BudgETS
                        </p>
                      </div>
                    </div>
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
                  <div style="background-color: #051914; padding: 40px 20px; font-family: Arial, sans-serif;">
                    <div style="margin: 0 auto; text-align: center;">
                      <h1 style="color: #AADD66; font-size: 28px; font-style: italic; margin-bottom: 30px;">BudgETS</h1>
                      <h2 style="color: #FCF6EB; font-size: 22px; font-weight: normal;">Salut!</h2>
                      <p style="color: #FCF6EB; font-size: 16px; line-height: 1.5; margin: 20px 0;">
                        <span style="color: #AADD66; font-weight: bold;">${inviterName}</span> t'a invité à collaborer sur l'objectif 
                        <span style="color: #AADD66; font-weight: bold;">"${goalTitle}"</span> dans BudgETS.
                      </p>
                      <p style="color: #FCF6EB; font-size: 16px; line-height: 1.5;">
                        Connecte-toi à l'application pour commencer à épargner ensemble!
                      </p>
                      <a href="https://budgets.up.railway.app" 
                        style="display: inline-block; margin-top: 20px; padding: 14px 40px; 
                              background-color: #003527;
                                  background: linear-gradient(to top, rgb(0,53,39), rgb(170,221,102));
                              color: #FCF6EB; font-size: 16px; 
                              font-weight: bold; text-decoration: none; border-radius: 25px;">
                        Connexion
                      </a>
                      <p style="color: #AADD66; font-size: 12px; margin-top: 40px;">
                        © BudgETS -- À L'ÉTS on gere son budget avec BudgETS
                      </p>
                    </div>
                  </div>
                 `,
    });
    return { success: true };
  } catch (error) {
    console.error('Erreur email invitation:', error);
    throw new InternalServerErrorException("Erreur lors de l'envoi de l'invitation.");
  }
}

/*@Cron('0 14 * * *') // TOus les jours @ 09:00
async sendDailyReminder() {
    const allowedDomains = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'live.com'];
    const users = await this.userRepository.find();
    
    const realUsers = users.filter(user => {
        const domain = user.adresse_email.split('@')[1]?.toLowerCase();
        return allowedDomains.includes(domain);
    });

    for (const user of realUsers) {
        console.log(`Sending to: ${user.adresse_email}`);
        try {
            await this.brevo.transactionalEmails.sendTransacEmail({
                sender: { name: 'BudgETS', email: process.env.GMAIL_USER },
                to: [{ email: user.adresse_email }],
                subject: 'Rappel: Notez vos dépenses du jour!',
                htmlContent: `
                  <div style="background-color: #051914; padding: 40px 20px; font-family: Arial, sans-serif;">
                    <div style="margin: 0 auto; text-align: center;">
                        <h1 style="color: #AADD66; font-size: 28px; font-style: italic; margin-bottom: 30px;">BudgETS</h1>
                        <h2 style="color: #FCF6EB; font-size: 22px; font-weight: normal;">Bonjour ${user.prenom}!</h2>
                        <p style="color: #FCF6EB; font-size: 16px; margin: 20px 0;">
                            N'oubliez pas de noter vos dépenses d'aujourd'hui dans BudgETS.
                        </p>
                        <a href="https://budgets.up.railway.app" 
                          style="display: inline-block; margin-top: 20px; padding: 14px 40px; 
                                  background-color: #003527;
                                  background: linear-gradient(to top, rgb(0,53,39), rgb(170,221,102));
                                  color: #FCF6EB; font-size: 16px; 
                                  font-weight: bold; text-decoration: none; border-radius: 25px;">
                            Connexion
                        </a>
                        <p style="color: #AADD66; font-size: 12px; margin-top: 40px;">
                            © BudgETS -- À L'ÉTS on gere son budget avec BudgETS
                        </p>
                    </div>
                  </div>
              `,
            });
        } catch (error) {
            console.error(`FAILED: ${user.adresse_email}`, error);
        }
    }
}*/

}