import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { AUTH_TOKENS } from '@modules/auth/auth-tokens';
import { Inject, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import type { ISocektAuthService } from '@modules/auth/interfaces/services.interface';
import type { ISocketData } from './interfaces/socket-data.interface';
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
  CHAT_COMMON_EVENTS,
  CHAT_SERVER_EVENTS,
} from '@shared/constants/enums/events.enum';
import { SendMessageDto } from './dto/send-message.dto';
import type {
  IAnswerPayload,
  ICallHangupTo,
  ICallRejectTo,
  IIceCandidatePayload,
  IOfferTo,
} from './interfaces/video-chat.interface';

@WebSocketGateway({
  cors: { origin: 'http://localhost:4200', credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server<any, ServerEvents>;

  connections = new Map<string, string>();

  _logger = new Logger(ChatGateway.name);

  constructor(
    @Inject(CHAT_TOKEN.CHAT_SERVICE) private _chatService: IChatService,

    @Inject(CHAT_TOKEN.MESSAGE_SERVICE)
    private _messageService: IMessageService,

    @Inject(AUTH_TOKENS.SOCKET_AUTH_SERVICE)
    private _socketAuthService: ISocektAuthService,
  ) {}

  // on connecting to the socket server
  async handleConnection(
    @ConnectedSocket() client: Socket<any, any, any, ISocketData>,
  ) {
    try {
      await this._socketAuthService.authenticateSocket(client);
      this.connections.set(client.data.user.id, client.id);
      this._logger.verbose(
        `New user connected with id: ${client.data.user.id}`,
      );
    } catch (err) {
      if (err instanceof WsException) {
        client.emit('authError', {
          code: err.getError(),
        });
      }

      client.disconnect();
    }
  }

  // on joining to a chat
  @SubscribeMessage(CHAT_CLIENT_EVENTS.JOIN_CHAT)
  async handleJoinChat(
    @ConnectedSocket() client: Socket<any, any, any, ISocketData>,
    @MessageBody() data: { roomId: string },
  ) {
    this._logger.verbose('join requeste came in server');
    this._logger.verbose(
      `User with id: ${client.data.user.id} wants to join to a room with id: ${data.roomId}`,
    );
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
    const messages = await this._messageService.findAllByRoomId(data.roomId);
    return { success: true, data: messages };
  }

  // read chat
  @SubscribeMessage(CHAT_CLIENT_EVENTS.READ_MESSAGE)
  async handleReadMessage(
    @MessageBody() data: { roomId: string; senderId: string },
  ) {
    await this._messageService.markMessagesAsRead(data.roomId, data.senderId);
  }

  // new message listener
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @SubscribeMessage(CHAT_CLIENT_EVENTS.SEND_MESSAGE)
  async handleSendMessage(
    @MessageBody() dto: SendMessageDto,
    @CurrentUser() user: IPayload,
  ) {
    // save message to db
    const savedMessage = await this._messageService.create(
      user.id,
      dto.roomId,
      dto.type,
      {
        text: dto.message,
        publicKey: dto.publicKey,
      },
    );

    // emit message to room
    this.server
      .to(dto.roomId)
      .emit(CHAT_SERVER_EVENTS.NEW_MESSAGE, savedMessage);
  }

  // handle offer
  @SubscribeMessage(CHAT_CLIENT_EVENTS.OFFER_ARRIVED)
  handleOffer(
    @CurrentUser() user: IPayload,
    @MessageBody() offerData: IOfferTo,
  ) {
    this._logger.verbose(`Offer receved from the user with id: ${user.id}`);
    console.log(`And wants to connect with user with id: ${offerData.to.id}`);
    console.log(offerData.to);

    const toUserSocket = this.connections.get(offerData.to.id);
    if (toUserSocket) {
      this.server.to(toUserSocket).emit('offer', {
        from: {
          id: user.id,
          name: user.firstName,
        },
        offer: offerData.offer,
      });
    }
  }

  // handle reject
  @SubscribeMessage(CHAT_COMMON_EVENTS.CALL_REJECT)
  handleReject(
    @CurrentUser() user: IPayload,
    @MessageBody() rejectData: ICallRejectTo,
  ) {
    this._logger.verbose(
      `Offer Rejected/ call rejected from ${user.firstName} to: ${rejectData.to}`,
    );

    const toUserSocket = this.connections.get(rejectData.to);

    if (toUserSocket) {
      this.server.to(toUserSocket).emit('callReject', {
        from: rejectData.to,
      });
    }
  }

  @SubscribeMessage(CHAT_COMMON_EVENTS.CALL_HANGUP)
  handleHangup(
    @CurrentUser() user: IPayload,
    @MessageBody() hangupData: ICallHangupTo,
  ) {
    this._logger.verbose(
      `Call hangup from ${user.firstName} to: ${hangupData.to.id}`,
    );

    const toUserSocket = this.connections.get(hangupData.to.id);

    if (toUserSocket) {
      this.server.to(toUserSocket).emit('callHangup', {
        from: { id: user.id, name: user.firstName },
      });
    }
  }

  // handle ice candidates
  @SubscribeMessage('iceCandidates')
  handleIceCandidates(
    @CurrentUser() user: IPayload,
    @MessageBody() data: IIceCandidatePayload,
  ) {
    this._logger.verbose(
      `Ice Candidates receved from the user with id: ${user.id}`,
    );
    console.log(`And wants to send to :${data.to}`);

    const toUserSocket = this.connections.get(data.to);
    if (toUserSocket) {
      this.server.to(toUserSocket).emit('iceCandidates', {
        candidate: data.candidate,
        from: user.id,
      });
    }
  }

  // handle answer
  @SubscribeMessage('answer')
  handleAnswer(
    @CurrentUser() user: IPayload,
    @MessageBody() answerData: IAnswerPayload,
  ) {
    this._logger.verbose(
      `Answer got from: ${user.id} send to : ${answerData.to}`,
    );
    const toUserSocket = this.connections.get(answerData.to);

    if (toUserSocket) {
      this.server.to(toUserSocket).emit('answer', {
        from: user.id,
        answer: answerData.answer,
      });
    }
  }
}
