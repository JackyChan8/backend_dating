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
      relations: ['author', 'author.photos', 'dialog'],
      select: {
        id: true,
        text: true,
        read: true,
        created_at: true,
        author: {
          id: true,
          photos: { id: true, filename: true, isAvatar: true },
        },
        dialog: { id: true },
      },
      order: {
        created_at: 'ASC',
        author: { photos: { id: 'ASC' } },
      },
    });
  }

  async getOne(
    dialogId: number,
    messageId: number,
  ): Promise<Messages | Messages[]> {
    const message = await this.messageRepository.find({
      where: { id: messageId, dialog: { id: dialogId } },
      relations: [
        'author',
        'author.photos',
        'dialog',
        'dialog.author',
        'dialog.partner',
      ],
      select: {
        id: true,
        text: true,
        read: true,
        created_at: true,
        author: {
          id: true,
          photos: { id: true, filename: true, isAvatar: true },
        },
        dialog: {
          id: true,
          author: {
            id: true,
          },
          partner: {
            id: true,
          },
        },
      },
      order: {
        created_at: 'ASC',
        author: { photos: { id: 'ASC' } },
      },
    });
    if (message.length) {
      return message[0];
    } else {
      return message;
    }
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
          data: await this.getOne(data.dialog, message.identifiers[0].id),
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

  async changeReadStatus(dialogId: number, userId: number): Promise<boolean> {
    let partnerId;
    const dialog = await this.dialogService.getPartnerDialog(dialogId);
    if (dialog) {
      partnerId = dialog.author.id === userId ? dialog.partner.id : dialog.author.id;
    }
    const messages = (
      await this.messageRepository.update(
        { dialog: { id: dialogId }, author: { id: partnerId }},
        { read: true, }
      )
    ).affected
    if (messages) {
      return true;
    } else {
      return false;
    }
  }
}
