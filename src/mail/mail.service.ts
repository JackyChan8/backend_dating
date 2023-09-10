import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { SendActivationMailBody } from './dto/send-activation-mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendActivationMail(dto: SendActivationMailBody): Promise<boolean> {
    const response = await this.mailerService.sendMail({
      from: 'rob-nerd@yandex.ru',
      to: dto.to,
      subject: 'Подтверждение аккаунта',
      text: '',
      html: `
      <div>
					<h1>Для активации перейдите по ссылке</h1>
					<a href="${dto.link}">Ссылка</a>
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
