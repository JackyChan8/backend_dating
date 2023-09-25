import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Server } from 'socket.io';

import { UsersService } from 'src/users/users.service';

import { Notification } from './models/notification.entity';
import { NotifyCreateInterface } from './interfaces/notification.interface';

@Injectable()
export class NotificationService {
  public socket: Server;

  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notifyRepository: Repository<Notification>,
    private readonly usersService: UsersService,
  ) {}

  async create(data: NotifyCreateInterface) {
    try {
      const partner = await this.usersService.findByID(data.partnerId);
      if (partner) {
        // Create Notification
        await this.notifyRepository
          .createQueryBuilder()
          .insert()
          .into(Notification)
          .values({
            type: data.type,
            user: partner,
            text: data.text,
          })
          .execute();
        // Send Notification
        this.socket.emit('server:get_notify', {
          user: data.partnerId,
          text: data.text,
        })
      }
    } catch (e) {
      console.log('Ошибка create Notification');
    }
  }
}
