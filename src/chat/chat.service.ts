import { HttpException, Injectable } from '@nestjs/common';

import { DialogService } from './modules/dialog/dialog.service';
import { MessageService } from './modules/message/message.service';

import {
  DialogCreateInterface,
  MessageCreateInterface,
} from './interfaces/chat.interface';

@Injectable()
export class ChatService {
  constructor(
    private readonly dialogService: DialogService,
    private readonly messageService: MessageService,
  ) {}

  async createDialog(data: DialogCreateInterface) {
    // Create Dialog
    const resDialog = await this.dialogService.create(data);
    if (resDialog.status === 201 && resDialog.data) {
      // Create Message
      const resMessage = await this.messageService.create(resDialog.data);
      // !!! Check Created Message !!!
      if (resMessage.status !== 201) {
        throw new HttpException(
          'The dialog has been created, but the message has not been sent',
          200,
        );
      }
    }
    throw new HttpException(resDialog.message, resDialog.status);
  }
  async createMessage(data: MessageCreateInterface) {
    // Check Exist Dialog
    const isDialog = await this.dialogService.checkExistByID(
      data.dialog,
      data.author,
    );
    if (isDialog) {
      const res = await this.messageService.create(data);
      if (res.status === 201) {
        // Update Last Message Dialog
        const updateRes = await this.dialogService.update(
          data.dialog,
          data.text,
        );
        if (!updateRes) {
          throw new HttpException(
            'The message has been created, but dialog has not update last message',
            200,
          );
        }
        return res;
      }
    } else {
      return { status: 404, message: 'Dialog does not exist' };
    }
  }
}
