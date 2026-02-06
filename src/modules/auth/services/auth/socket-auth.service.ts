import type {
  ISocektAuthService,
  ITokenService,
} from '@modules/auth/interfaces/services.interface';
import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import * as cookie from 'cookie';
import { AUTH_TOKENS } from '@modules/auth/auth-tokens';
import { WsException } from '@nestjs/websockets';
import { ISocketData } from '@modules/chat/interfaces/socket-data.interface';
import { AUTH_MESSAGES } from '@shared/constants/messages/auth-messages.constant';

@Injectable()
export class SocketAuthService implements ISocektAuthService {
  constructor(
    @Inject(AUTH_TOKENS.TOKEN_SERVICE) private _tokenService: ITokenService,
  ) {}

  async authenticateSocket(
    client: Socket<any, any, any, ISocketData>,
  ): Promise<void> {
    // extract access token from cookie
    const cookies = cookie.parse(client.handshake.headers.cookie || '');
    const accessToken = cookies['access-token'];

    if (!accessToken) {
      throw new WsException(AUTH_MESSAGES.WS_ACCESS_TOKEN_EXPIRED);
    }

    try {
      const payload = await this._tokenService.verifyToken(accessToken);
      client.data.user = payload;
    } catch {
      throw new WsException(AUTH_MESSAGES.WS_ACCESS_TOKEN_EXPIRED);
    }
  }
}
