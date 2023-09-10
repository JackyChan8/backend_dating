import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendActivationMail(to: string, link: string): Promise<boolean> {
    const response = await this.mailerService.sendMail({
      from: 'rob-nerd@yandex.ru',
      to: to,
      subject: 'Подтверждение аккаунта',
      text: '',
      html: `
      <div>
					<h1>Для активации перейдите по ссылке</h1>
					<a href="${link}">Ссылка</a>
				</div>
      `,
    });
    if (response.accepted) {
      return true;
    } else {
      return false;
    }
  }
}
