import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';

export const CookiePayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IAuthenticatedReqeust>();
    return request.user;
  },
);
