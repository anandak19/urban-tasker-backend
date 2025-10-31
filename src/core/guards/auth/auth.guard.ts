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
    // take the request
    const request = context.switchToHttp().getRequest<Request>();
    // extract access token from header
    const token = this._extractTokenFromHeader(request);
    if (!token) {
      this._logger.verbose('Token not found in request header');
      // this will force clint to call - refresh
      throw new UnauthorizedException();
    }

    try {
      // extract paylod from token
      const payload = await this._tokenService.verifyToken(token);
      // here assing the payload to req.user
      request.user = payload;
    } catch {
      this._logger.error('Token verification failed');
      // access token is expired / invalid / malformed
      // this will force clint to call - refresh
      throw new UnauthorizedException();
    }
    // continue request to contoller :)
    return true;
  }

  // extracts token from auth header, else return undefind
  private _extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
