import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import {
  DialogInterface,
  DialogResInterface,
} from './interfaces/dialog.interface';
import { Dialogs } from './models/dialog.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DialogService {
  constructor(
    @Inject('DIALOGS_REPOSITORY')
    private dialogRepository: Repository<Dialogs>,
    private usersService: UsersService,
  ) {}

  async checkExistByUsersID(
    authorID: number,
    partnerID: number,
  ): Promise<boolean> {
    return await this.dialogRepository.exist({
      where: [
        { author: { id: authorID }, partner: { id: partnerID } },
        { author: { id: partnerID }, partner: { id: authorID } },
      ],
    });
  }

  async checkExistByID(dialogID: number, userID: number): Promise<boolean> {
    return await this.dialogRepository.exist({
      where: [
        { id: dialogID, author: { id: userID } },
        { id: dialogID, partner: { id: userID } },
      ],
    });
  }

  async getDialog(dialogID: number): Promise<Dialogs | null> {
    return this.dialogRepository.findOneBy({ id: dialogID });
  }

  async getAll(userID: number): Promise<Dialogs | Dialogs[]> {
    return await this.dialogRepository.find({
      where: [{ author: { id: userID } }, { partner: { id: userID } }],
      relations: [
        'author',
        'partner',
        'author.photos',
        'partner.photos',
        'author.profile',
        'partner.profile',
        'messages',
        'messages.author',
      ],
      select: {
        id: true,
        author: {
          id: true,
          photos: {
            id: true,
            filename: true,
            isAvatar: true,
          },
          profile: {
            firstName: true,
          },
        },
        partner: {
          id: true,
          photos: {
            id: true,
            filename: true,
            isAvatar: true,
          },
          profile: {
            firstName: true,
          },
        },
        lastMessage: true,
        messages: {
          read: true,
          author: {
            id: true,
          },
        },
      },
      order: {
        created_at: 'ASC',
      },
    });
  }

  async update(dialogID: number, message: string) {
    const post = (
      await this.dialogRepository.update(
        { id: dialogID },
        { lastMessage: message },
      )
    ).affected;
    console.log('post: ', post);
    if (post === 1) {
      return true;
    } else {
      return false;
    }
  }

  async create(data: DialogInterface): Promise<DialogResInterface> {
    // Check Exist Dialog
    const isExist = await this.checkExistByUsersID(data.author, data.partner);
    if (!isExist) {
      // Get Users
      const author = await this.usersService.findByID(data.author);
      const partner = await this.usersService.findByID(data.partner);
      if (author && partner) {
        // Create Dialog
        const dialog = await this.dialogRepository
          .createQueryBuilder()
          .insert()
          .into(Dialogs)
          .values({
            author: author,
            partner: partner,
            lastMessage: data.message,
          })
          .execute();
        if (dialog) {
          // Create Message
          return {
            status: 201,
            message: 'Dialog created successfully',
            data: {
              author: data.author,
              dialog: dialog.raw[0].id,
              text: data.message,
            },
          };
        } else {
          return {
            status: 500,
            message: 'An error occurred while creating the dialog',
          };
        }
      } else {
        return {
          status: 500,
          message: 'An error occurred while creating the dialog',
        };
      }
    } else {
      return { status: 409, message: 'Dialog already exists' };
    }
  }
}
