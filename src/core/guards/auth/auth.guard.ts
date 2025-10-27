import { AUTH_TOKENS } from '@modules/auth/auth-tokens';
import { type ITokenService } from '@modules/auth/interfaces/services.interface';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { type Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private _logger = new Logger(AuthGuard.name);
  constructor(
    @Inject(AUTH_TOKENS.TOKEN_SERVICE) private _tokenService: ITokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this._extractTokenFromHeader(request);
    if (!token) {
      this._logger.verbose('Token not found in request header');
      throw new UnauthorizedException();
    }

    try {
      // extract paylod from token
      const payload = await this._tokenService.verifyToken(token);
      // --here assing the payload to req.user in any way
      request.user = payload;
    } catch {
      this._logger.error('Token verification failed');
      throw new UnauthorizedException();
    }

    return true;
  }

  // extracts token from auth header, else return undefind
  private _extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
