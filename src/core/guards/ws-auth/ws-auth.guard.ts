import { AUTH_TOKENS } from '@modules/auth/auth-tokens';
import type { ITokenService } from '@modules/auth/interfaces/services.interface';
import { ISocketData } from '@modules/chat/interfaces/socket-data.interface';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import * as cookie from 'cookie';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_TOKENS.TOKEN_SERVICE) private _tokenService: ITokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket<any, any, any, ISocketData> = context
      .switchToWs()
      .getClient();

    try {
      const cookies = cookie.parse(client.handshake.headers.cookie || '');
      const accessToken = cookies['access-token'];
      if (!accessToken) {
        console.log('Token not found in ws connection header');
        client.disconnect();
        return false;
      }

      const payload = await this._tokenService.verifyToken(accessToken);

      client.data.user = payload;
      console.log('Data stored in guard');

      return true;
    } catch {
      client.emit('accessTokenExpired');

      console.log('[Guard] Calling disconnect');
      client.disconnect();
      return false;
    }
  }
}
