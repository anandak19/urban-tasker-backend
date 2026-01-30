import { AppConfig } from '@config/app.config';
import type { ILoggerService } from '@core/lib/logger/logger.interface';
import { LOGGER_SERVICE } from '@core/lib/logger/logger.service';
import type { ISecretsManagerService } from '@core/lib/ssm/interfaces/ssm-services.interface';
import { SSM_TOKENS } from '@core/lib/ssm/ssm.token';
import { IPayload, ITokens } from '@modules/auth/interfaces/auth.interface';
import { ITokenService } from '@modules/auth/interfaces/services.interface';
import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { SESSION_MESSAGES } from '@shared/constants/messages/auth-messages.constant';
import { StringValue } from 'ms';

@Injectable()
export class TokenService implements ITokenService {
  private readonly _accessTokenTime = '1d'; // default '120s'
  private readonly _refereshTokenTime = '7d';
  private readonly _resetTokenTime = '30m';
  private readonly _defaultTokenTime = '10s';
  private JWT_SECRET: string;

  constructor(
    @Inject(LOGGER_SERVICE) private _logger: ILoggerService,
    private _jwtService: JwtService,
    private _configService: ConfigService<AppConfig>,

    @Inject(SSM_TOKENS.SECRETS_SERVICE)
    private _secretsService: ISecretsManagerService,
  ) {
    this.JWT_SECRET = _configService.get('JWT_SECRET')!;
    _logger.verbose('Got the secret');
    console.log(this.JWT_SECRET);
  }

  // varify token
  async verifyToken(token: string): Promise<IPayload> {
    try {
      const payload = await this._jwtService.verifyAsync<IPayload>(token, {
        secret: this.JWT_SECRET,
      });

      if (!payload) {
        throw new ForbiddenException(SESSION_MESSAGES.AUTH_EXPIRED);
      }

      return payload;
    } catch {
      this._logger.error('Token Varification faild');
      throw new ForbiddenException(SESSION_MESSAGES.AUTH_EXPIRED);
    }
  }

  // returns access and refresh tokens
  async getAuthTokens(payload: IPayload): Promise<ITokens> {
    this._logger.verbose('Got the secret in get token');
    console.log(this.JWT_SECRET);

    const accessToken = await this._getToken(payload, this._accessTokenTime);
    const refreshToken = await this._getToken(payload, this._refereshTokenTime);
    return { accessToken, refreshToken };
  }

  async getNewAccessToken(payload: IPayload): Promise<string> {
    return await this._getToken(payload, this._accessTokenTime);
  }

  // returns reset password token
  async getResetToken(payload: IPayload): Promise<string> {
    return await this._getToken(payload, this._resetTokenTime);
  }

  /**
   * Return new singned jwt token
   * @param {IPayload} payload - payload for token
   * @param {StringValue | number} expiresIn - The token's expiration duration.
   * @returns {Promise<string>} A promise that resolves to the signed JWT token.
   * */
  private async _getToken(
    payload: IPayload,
    expiresIn: StringValue | number = this._defaultTokenTime,
  ): Promise<string> {
    console.log('Payload to create token', payload);
    try {
      const options: JwtSignOptions = {
        secret: this.JWT_SECRET,
        expiresIn,
      };
      return await this._jwtService.signAsync(payload, options);
    } catch {
      this._logger.error('Token generation faild');
      throw new InternalServerErrorException('Failed to generate token');
    }
  }
}
