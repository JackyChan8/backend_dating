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
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
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

    console.log('users 1: ', users);
  }

  // отключение
  handleDisconnect(client: Socket) {
    console.log('handleDisconnect');
    const socketId = client.id;
    delete users[socketId];
  }

  // получение всех сообщений
  @SubscribeMessage('messages:get')
  async handleMessagesGet(): Promise<void> {
    console.log('messages:get');
    // const messages = await this.appService.getMessages();
    // this.server.emit('messages', messages);
  }

  // удаление всех сообщений
  @SubscribeMessage('messages:clear')
  async handleMessagesClear(): Promise<void> {
    console.log('messages:clear');
  }

  // создание сообщения
  @SubscribeMessage('message:post')
  async handleMessagePost(
    @MessageBody()
    payload: // { userId: string, userName: string, text: string }
    MessageCreateInterface,
  ): Promise<void> {
    console.log('message:post: ', payload);
    // Create Message

    // Notification and Add To Message Array

    // const createdMessage = await this.appService.createMessage(payload);
    // // можно сообщать клиентам о каждой операции по отдельности
    // this.server.emit('message:post', createdMessage);
    // // но мы пойдем более простым путем
    // this.handleMessagesGet();
  }

  // обновление сообщения
  @SubscribeMessage('message:put')
  async handleMessagePut(
    @MessageBody()
    payload: // { id: number, text: string }
    any,
  ): Promise<void> {
    console.log('message:put: ', payload);
    // const updatedMessage = await this.appService.updateMessage(payload);
    // this.server.emit('message:put', updatedMessage);
    // this.handleMessagesGet();
  }

  // удаление сообщения
  @SubscribeMessage('message:delete')
  async handleMessageDelete(
    @MessageBody()
    payload: // { id: number }
    any,
  ) {
    console.log('message:delete: ', payload);
    // const removedMessage = await this.appService.removeMessage(payload);
    // this.server.emit('message:delete', removedMessage);
    // this.handleMessagesGet();
  }
}
