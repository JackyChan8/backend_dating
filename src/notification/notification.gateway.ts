import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { AuthService } from 'src/auth/auth.service';

import { CLIENT_URI } from 'src/constants';
import { NotificationService } from './notification.service';

@WebSocketGateway({
  cors: {
    origin: CLIENT_URI,
  },
  serveClient: false,
  namespace: 'notify',
})
export class NotifyGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly notifyService: NotificationService,
    private readonly authService: AuthService,
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('afterInit NotifyGateway');
    // Middleware Check Token
    server.use(async (socket, next) => {
      console.log('Middleware NotifyGateway');
      let user;
      const token = socket.handshake.headers.authorization;
      // Проверка токена
      if (token) {
        user = await this.authService.getUserFromAuthenticationToken(token);
        if (!user) {
          return next(new Error('Invalid credentials'));
        }
      }
      next();
    });

    this.notifyService.socket = server;
  }

  // подключение
  async handleConnection(socket: Socket) {
    console.log('handleConnection - NotifyGateway');
    console.log(`Socket ${socket.id} connected.`);
  }

  // отключение
  async handleDisconnect(client: Socket) {
    console.log('handleDisconnect - NotifyGateway');

    client.broadcast.emit('log', `${client.id} disconnected`);
  }
}
