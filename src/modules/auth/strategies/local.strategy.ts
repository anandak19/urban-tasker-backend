import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import type { IAuthService } from '../interfaces/services.interface';
import { Inject } from '@nestjs/common';
import { AUTH_TOKENS } from '../auth-tokens';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AUTH_TOKENS.AUTH_SERVICE) private _authService: IAuthService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    console.log(email);
    console.log(password);
    const user = await this._authService.validateLocalUser(email, password);
    return user || null;
  }
}
