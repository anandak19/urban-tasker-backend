import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { AUTH_TOKENS } from '@modules/auth/auth-tokens';
import { Inject } from '@nestjs/common';
import type { ITokenService } from '@modules/auth/interfaces/services.interface';
import { ISocketData } from './interfaces/socket-data.interface';
import * as cookie from 'cookie';
import { ServerEvents } from './interfaces/events.interface';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server<any, ServerEvents>;

  private users = new Map<string, string>(); // userid -> socketId

  constructor(
    @Inject(AUTH_TOKENS.TOKEN_SERVICE) private _tokenService: ITokenService,
  ) {}

  // on connecting to the socket server
  async handleConnection(client: Socket<any, any, any, ISocketData>) {
    try {
      // extract access token from cookie
      const cookies = cookie.parse(client.handshake.headers.cookie || '');
      const accessToken = cookies['access-token'];

      // if no access token disconnect the connection
      if (!accessToken) {
        client.disconnect();
        return;
      }

      // varify the access token and extract payload out of it
      const payload = await this._tokenService.verifyToken(accessToken);

      // attach payload to client socket
      client.data.user = payload;

      // map and store user id -> socket id
      this.users.set(payload.id, client.id);

      console.log('Socket authenticated:', payload);
    } catch {
      client.emit('auth_error', { message: 'Unauthorized' });
      client.disconnect();
    }
  }

  // on joining to a chat
  @SubscribeMessage('join-chat')
  async handleJoinChat(
    client: Socket<any, any, any, ISocketData>,
    data: { targetUserId: string },
  ) {
    const myId = client.data.user.id;
    // create room with
    const roomId = this.getRoomId(myId, data.targetUserId);

    if (!client.rooms.has(roomId)) {
      await client.join(roomId);
    }

    console.log(`User ${myId} joined room ${roomId}`);

    return { roomId };
  }

  handleDisconnect(client: Socket<any, any, any, ISocketData>) {
    console.log(`Client disconnected: ${client.id}`);
    client.disconnect();
  }

  // new message listener
  @SubscribeMessage('send-message')
  handleSendMessage(
    client: Socket<any, any, any, ISocketData>,
    data: { roomId: string; message: string },
  ) {
    // --- here write logic to save message to db

    // emit message to room
    this.server.to(data.roomId).emit('newMessage', {
      from: client.data.user.id,
      message: data.message,
    });
  }

  private getRoomId(user1: string, user2: string) {
    return [user1, user2].sort().join('_');
  }
}
