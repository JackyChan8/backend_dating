import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { CLIENT_URI } from 'src/constants';
import { TypeNotification } from 'src/notification/types/notification';
import {
  MessageCreateInterface,
  MessagesReadInterface,
} from './interfaces/chat.interface';

import { AuthService } from 'src/auth/auth.service';
import { MessageService } from './modules/message/message.service';
import { DialogService } from './modules/dialog/dialog.service';
import { NotificationService } from 'src/notification/notification.service';
import { ProfileService } from 'src/profile/profile.service';

const users: Record<string, number> = {};

@WebSocketGateway({
  cors: {
    origin: CLIENT_URI,
  },
  serveClient: false,
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly dialogService: DialogService,
    private readonly messageService: MessageService,
    private readonly notifyService: NotificationService,
    private readonly profileService: ProfileService,
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('afterInit ChatGateway');

    // Middleware Check Token
    server.use(async (socket, next) => {
      console.log('Middleware');
      let user;
      const token = socket.handshake.headers.authorization;
      // Проверка токена
      if (token) {
        user = await this.authService.getUserFromAuthenticationToken(token);
        if (user) {
          const socketId = socket.id;
          users[socketId] = user.id;
        } else {
          return next(new Error('Invalid credentials'));
        }
      }
      next();
    });
  }

  // подключение
  async handleConnection(socket: Socket) {
    console.log('handleConnection - ChatGateway');
    console.log(`Socket ${socket.id} connected.`);
  }

  // отключение
  async handleDisconnect(client: Socket) {
    console.log('handleDisconnect - ChatGateway');
    const socketId = client.id;
    delete users[socketId];

    client.broadcast.emit('log', `${socketId} disconnected`);
  }

  /**
   * @param {number} dialogId Dialog Identificator
   * @param {number} authorId User Identificator
   * @returns {void} Undefined
   **/
  async notification(dialogId: number, authorId: number): Promise<void> {
    const chatNewMessage = 'Вам пришло сообщение от пользователя';
    try {
      // Получаем ID партнера в диалоге
      let partnerId;
      const dialog = await this.dialogService.getPartnerDialog(dialogId);
      if (dialog) {
        partnerId =
          dialog.author.id === authorId ? dialog.partner.id : dialog.author.id;
        
        // Получаем Имя пользователя
        const profile = await this.profileService.getFirstName(authorId);
        if (profile) {
          let text = `${chatNewMessage} ${profile.firstName}`;
          // Создаем уведомление
          await this.notifyService.create({
            author: { id: authorId, firstName: profile.firstName },
            dialogId: dialogId,
            partnerId: partnerId,
            type: TypeNotification.CHAT,
            text: text,
          });
        }
      }
    } catch (err) {
      console.log('Error notification function: ', err);
    }
  }

  // создание сообщения
  @SubscribeMessage('message:post')
  async handleMessagePost(
    @MessageBody()
    payload: MessageCreateInterface,
  ): Promise<void> {
    console.log('handleMessagePost - message:post', payload);
    // Проверка входит ли Пользователь в диалог
    const checkInDialog = await this.dialogService.checkExistByID(
      payload.dialog,
      payload.author,
    );
    if (checkInDialog) {
      // Создаем сообщение
      const res = await this.messageService.create(payload);
      if (res.status === 201) {
        // Обновление последнего сообщения в диалоге
        await this.dialogService.update(payload.dialog, payload.text);
        // Отправка сообщения на клиент
        this.server.emit('server:new_message', res.data);
        // Уведолмение
        this.notification(payload.dialog, payload.author);
      } else {
        // Отправка сообщения об ошибке
        this.server.emit('message_error', {
          userId: payload.author,
          message: 'Произошла ошибка при создании сообщения',
        });
      }
    } else {
      // Отправка сообщения об ошибке
      this.server.emit('message_error', {
        userId: payload.author,
        message: 'Вас нет в диалоге',
      });
    }
  }

  @SubscribeMessage('messages:read')
  async handleMessageRead(
    @MessageBody()
    payload: MessagesReadInterface,
  ) {
    console.log('handleMessageRead - messages:read: ', payload);
    // Проверка входит ли Пользователь в диалог
    const checkInDialog = await this.dialogService.checkExistByID(
      payload.dialog,
      payload.user,
    );
    if (checkInDialog) {
      const res = await this.messageService.changeReadStatus(
        payload.dialog,
        payload.user,
      );
      if (res) {
        this.server.emit('server:read_message', {
          dialog: payload.dialog,
          user: payload.user,
        });
      }
    } else {
      // Отправка сообщения об ошибке
      this.server.emit('message_error', {
        userId: payload.user,
        message: 'Вас нет в диалоге',
      });
    }
  }
}
