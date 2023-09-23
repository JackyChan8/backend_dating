import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { CLIENT_URI } from './constants';
import { MessageCreateInterface } from './interfaces/chat.interface';

import { ChatService } from './chat.service';
import { AuthService } from 'src/auth/auth.service';
import { MessageService } from './modules/message/message.service';
import { DialogService } from './modules/dialog/dialog.service';

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
    private readonly chatService: ChatService,
    private readonly dialogService: DialogService,
    private readonly messageService: MessageService,
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('afterInit');
    console.log(server);
  }

  // подключение
  async handleConnection(socket: Socket) {
    console.log('handleConnection');
    const token = socket.handshake.headers.authorization;
    let user;
    // Проверка токена
    if (token) {
      user = await this.authService.getUserFromAuthenticationToken(token);
      if (!user) {
        throw new WsException('Invalid credentials.');
      }
      const socketId = socket.id;
      users[socketId] = user?.id;
    }

    console.log(`Socket ${socket.id} connected.`);
  }

  // отключение
  async handleDisconnect(client: Socket) {
    console.log('handleDisconnect');
    const socketId = client.id;
    delete users[socketId];

    client.broadcast.emit('log', `${socketId} disconnected`);
  }

  // получение всех сообщений
  @SubscribeMessage('messages:get')
  async handleMessagesGet(): Promise<void> {
    console.log('handleMessagesGet - messages:get');
    // const messages = await this.appService.getMessages();
    // this.server.emit('messages', messages);
  }

  // // удаление всех сообщений
  // @SubscribeMessage('messages:clear')
  // async handleMessagesClear(): Promise<void> {
  //   console.log('handleMessagesClear - messages:clear');
  // }

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
        // Получения сообщения
        console.log('Success Created Message');
        console.log('res.data: ', res.data);
        // Отправка сообщения на клиент
        this.server.emit('server:new_message', res.data);
      } else {
        // Отправка сообщения об ошибке
      }
    } else {
      throw new WsException('Invalid credentials.');
    }
  }

  // // обновление сообщения
  // @SubscribeMessage('message:put')
  // async handleMessagePut(
  //   @MessageBody()
  //   payload: // { id: number, text: string }
  //   any,
  // ): Promise<void> {
  //   console.log('handleMessagePut - message:put', payload);
  //   // const updatedMessage = await this.appService.updateMessage(payload);
  //   // this.server.emit('message:put', updatedMessage);
  //   // this.handleMessagesGet();
  // }

  // // удаление сообщения
  // @SubscribeMessage('message:delete')
  // async handleMessageDelete(
  //   @MessageBody()
  //   payload: // { id: number }
  //   any,
  // ) {
  //   console.log('handleMessageDelete - message:delete', payload);
  //   // const removedMessage = await this.appService.removeMessage(payload);
  //   // this.server.emit('message:delete', removedMessage);
  //   // this.handleMessagesGet();
  // }
}
