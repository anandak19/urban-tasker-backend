import { Inject, Injectable } from '@nestjs/common';
import type {
  ISecretsManagerService,
  ISSMService,
} from '../../interfaces/ssm-services.interface';
import { SSM_TOKENS } from '../../ssm.token';

@Injectable()
export class SecretsManagerService implements ISecretsManagerService {
  constructor(@Inject(SSM_TOKENS.AWS_SSM) private _ssmService: ISSMService) {}

  getJwtSecret(): Promise<string> {
    return this._ssmService.getParameter('/ut/dev/jwt_secret');
  }
}
