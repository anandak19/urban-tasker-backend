import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/*
    For 2nd and 3rd step of singup process
    It checks if the singupId is in cookie
    (singupId is set after basic data got saved in redis)
    (signupId is the uuid of the redis cache)
*/
export class SignupIdMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const signupId: string = (req.cookies?.signupId as string) ?? '';
    if (!signupId) {
      throw new BadRequestException(
        'Signup session expired! Restart the singup process',
      );
    }
    next();
  }
}
