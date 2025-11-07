import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { type Request } from 'express';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext) {
    console.log('Called guard');
    const activate = (await super.canActivate(context)) as boolean;
    console.log('Called super.canactivate');
    const request = context.switchToHttp().getRequest<Request>();
    console.log('Called get request');
    await super.logIn(request);
    console.log('Called login on request using super');
    return activate;
  }
}
