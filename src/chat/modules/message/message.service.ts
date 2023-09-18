import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Messages } from './models/message.entity';
import {
  MessageInterface,
  MessageResInterface,
} from './interfaces/message.interface';
import { DialogService } from '../dialog/dialog.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessageService {
  constructor(
    @Inject('MESSAGES_REPOSITORY')
    private messageRepository: Repository<Messages>,
    private dialogService: DialogService,
    private usersService: UsersService,
  ) {}

  async getAll(dialogID: number): Promise<Messages | Messages[]> {
    return await this.messageRepository.find({
      where: { dialog: { id: dialogID } },
      relations: ['author'],
      select: {
        id: true,
        text: true,
        read: true,
        created_at: true,
        author: { id: true },
      },
      order: {
        created_at: 'ASC',
      },
    });
  }

  async create(data: MessageInterface): Promise<MessageResInterface> {
    // Check Exist Dialog
    const dialog = await this.dialogService.getDialog(data.dialog);
    const user = await this.usersService.findByID(data.author);
    if (dialog && user) {
      // Create Message
      const message = await this.messageRepository
        .createQueryBuilder()
        .insert()
        .into(Messages)
        .values({
          text: data.text,
          dialog: dialog,
          author: user,
        })
        .execute();
      if (message) {
        return {
          status: 201,
          message: 'Message created successfully',
        };
      } else {
        return {
          status: 500,
          message: 'An error occurred while creating the message',
        };
      }
    } else {
      return {
        status: 500,
        message: 'An error occurred while creating the message',
      };
    }
  }
}
