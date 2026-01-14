import {
  ConnectedSocket,
  MessageBody,
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
import type { ISocketData } from './interfaces/socket-data.interface';
import * as cookie from 'cookie';
import { ServerEvents } from './interfaces/events.interface';
import { CHAT_TOKEN } from './chat.token';
import type {
  IChatService,
  IMessageService,
} from './interfaces/chat-services.interface';
import { CurrentUser } from './decorators/current-user.decorator';
import type { IPayload } from '@modules/auth/interfaces/auth.interface';
import {
  CHAT_CLIENT_EVENTS,
  CHAT_SERVER_EVENTS,
} from '@shared/constants/enums/events.enum';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server<any, ServerEvents>;

  private users = new Map<string, string>(); // userid -> socketId

  constructor(
    @Inject(AUTH_TOKENS.TOKEN_SERVICE) private _tokenService: ITokenService,

    @Inject(CHAT_TOKEN.CHAT_SERVICE) private _chatService: IChatService,

    @Inject(CHAT_TOKEN.MESSAGE_SERVICE)
    private _messageService: IMessageService,
  ) {}

  // on connecting to the socket server
  async handleConnection(
    @ConnectedSocket() client: Socket<any, any, any, ISocketData>,
  ) {
    try {
      console.log('connection requeste came in server');

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
      client.emit('authError', { message: 'Unauthorized' });
      client.disconnect();
    }
  }

  // on joining to a chat
  @SubscribeMessage(CHAT_CLIENT_EVENTS.JOIN_CHAT)
  async handleJoinChat(
    @ConnectedSocket() client: Socket<any, any, any, ISocketData>,
    @MessageBody() data: { roomId: string },
  ) {
    console.log('join requeste came in server');
    // join the socket of requested clint to that room
    if (!client.rooms.has(data.roomId)) {
      await client.join(data.roomId);
    }

    /**
     * Fetch last 30 messages of the room using find all (last 30 docs if any)
     * Emit "messages" event with received messages array as data
     */
    const messages = await this._messageService.findAllByRoomId(data.roomId);
    this.server.to(data.roomId).emit('messages', messages);

    console.log(`User joined room ${data.roomId}`);

    return { success: true };
  }

  handleDisconnect(client: Socket<any, any, any, ISocketData>) {
    console.log(`Client disconnected: ${client.id}`);
    client.disconnect();
  }

  @SubscribeMessage(CHAT_CLIENT_EVENTS.GET_ALL_MESSAGES)
  async handleGetAllMessages(@MessageBody() data: { roomId: string }) {
    console.log('Called get all messages event');
    const messages = await this._messageService.findAllByRoomId(data.roomId);
    console.log(messages);
    return { success: true, data: messages };
  }

  // read chat
  @SubscribeMessage(CHAT_CLIENT_EVENTS.READ_MESSAGE)
  async handleReadMessage(
    @MessageBody() data: { roomId: string; senderId: string },
  ) {
    console.log('reading messages of sender ', data.senderId);
    console.log('in room ', data.roomId);

    await this._messageService.markMessagesAsRead(data.roomId, data.senderId);
  }

  // new message listener
  @SubscribeMessage(CHAT_CLIENT_EVENTS.SEND_MESSAGE)
  async handleSendMessage(
    @MessageBody() data: { roomId: string; message: string },
    @CurrentUser() user: IPayload,
  ) {
    // --- here write logic to save message to db
    const savedMessage = await this._messageService.create(
      user.id,
      data.roomId,
      data.message,
    );

    console.log(`New Message`);
    console.log(savedMessage);

    // emit message to room
    this.server
      .to(data.roomId)
      .emit(CHAT_SERVER_EVENTS.NEW_MESSAGE, savedMessage);
  }
}
