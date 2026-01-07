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

    const cookies = cookie.parse(client.handshake.headers.cookie || '');
    const accessToken = cookies['access-token'];
    if (!accessToken) {
      client.disconnect();
      return false;
    }

    try {
      const payload = await this._tokenService.verifyToken(accessToken);

      client.data.user = payload;
      console.log('Data stored in guard');

      return true;
    } catch {
      client.emit('auth_error', {
        message: 'Unauthorized',
      });
      console.log('[Guard] Calling disconnect');
      client.disconnect();
      return false;
    }
  }
}
