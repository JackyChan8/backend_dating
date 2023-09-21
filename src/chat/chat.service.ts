import { Injectable, HttpException } from '@nestjs/common';

import { Socket } from 'socket.io';

import { DialogService } from './modules/dialog/dialog.service';
import { MessageService } from './modules/message/message.service';

import {
  DialogCreateInterface,
  GetDialogsResponse,
  GetMessagesInterface,
  MessageCreateInterface,
} from './interfaces/chat.interface';

@Injectable()
export class ChatService {
  constructor(
    private readonly dialogService: DialogService,
    private readonly messageService: MessageService,
  ) {}

  async getManyDialogs(
    userID: number,
  ): Promise<GetDialogsResponse | HttpException> {
    // Get Dialogs
    const dialogs = await this.dialogService.getAll(userID);
    if (dialogs.length) {
      return {
        status: 200,
        message: 'Dialogs successfully received',
        data: dialogs,
      };
    } else {
      throw new HttpException(
        {
          status: 204,
          message: 'Dialogs does not exist',
        },
        204,
      );
    }
  }
  async getMessages(data: GetMessagesInterface) {
    // Check exist User in Chat
    const existInDialog = await this.dialogService.checkExistByID(
      data.dialogID,
      data.userID,
    );
    if (existInDialog) {
      // Get Messages
      const messages = await this.messageService.getAll(data.dialogID);
      if (messages.length) {
        return {
          status: 200,
          message: 'Messages successfully received',
          data: messages,
        };
      } else {
        throw new HttpException(
          {
            status: 204,
            message: 'Messages does not exist',
          },
          204,
        );
      }
    } else {
      throw new HttpException('Unauthorized', 401);
    }
  }
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

  async getUserFromSocket(socket: Socket) {
    const auth_token = socket.handshake.headers.authorization;
    console.log('auth_token: ', auth_token);
    // // get the token itself without "Bearer"
    // auth_token = auth_token.split(' ')[1];

    // const user = this.authService.getUserFromAuthenticationToken(auth_token);

    // if (!user) {
    //   throw new WsException('Invalid credentials.');
    // }
    // return user;
  }
}
