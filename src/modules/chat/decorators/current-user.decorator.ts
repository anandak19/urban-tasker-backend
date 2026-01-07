import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import type { ISocketData } from '../interfaces/socket-data.interface';

// extract socket attached user data to param
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const client: Socket<any, any, any, ISocketData> = ctx
      .switchToWs()
      .getClient<Socket<any, any, any, ISocketData>>();

    return client.data.user;
  },
);
