import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// checks if the given key is present in cookie
export const Cookies = createParamDecorator(
  (
    key: string,
    ctx: ExecutionContext,
  ): string | Record<string, string> | undefined => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const cookies = req.cookies as Record<string, string> | undefined;
    if (!cookies) return undefined;
    return key ? cookies[key] : cookies;
  },
);
