import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AUTH_TOKENS } from '../auth-tokens';
import { type IAuthService } from '../interfaces/services.interface';
import { IGoogleUserAuthData } from '../interfaces/auth.interface';
import { AppConfig } from '@config/app.config';
import { AuthService } from '../services/auth/auth.service';

// ERROR: I can't inject auth service from the di container
// scope is having an effect on this too
// circular dependecy is initial thougt for error
// when i inject service normally with out the injection token its working. (google login screen pops up)
// fix this

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly _authService: AuthService, // Direct injection instead of using injection token
    private readonly configService: ConfigService<AppConfig>,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID', { infer: true })!,
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET', {
        infer: true,
      })!,
      callbackURL: configService.get('GOOGLE_CALLBACK_URL', { infer: true })!,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    // check if the required values are there
    if (
      !profile._json.email ||
      !profile._json.given_name ||
      !profile._json.family_name
    ) {
      return null;
    }

    // create user object
    const userDetails: IGoogleUserAuthData = {
      email: profile._json.email,
      firstName: profile._json.given_name,
      lastName: profile._json.family_name,
    };

    // validate user / create user
    const user = await this._authService.validateGoogleAuthUser(userDetails);
    return user || null;
  }
}
