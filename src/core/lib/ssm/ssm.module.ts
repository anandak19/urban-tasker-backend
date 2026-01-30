import { Global, Module } from '@nestjs/common';
import { SSM_TOKENS } from './ssm.token';
import { AwsSsmService } from './services/aws-ssm/aws-ssm.service';
import { SecretsManagerService } from './services/secrets-manager/secrets-manager.service';

@Global()
@Module({
  providers: [
    { provide: SSM_TOKENS.AWS_SSM, useClass: AwsSsmService },
    { provide: SSM_TOKENS.SECRETS_SERVICE, useClass: SecretsManagerService },
    AwsSsmService,
  ],
  exports: [SSM_TOKENS.SECRETS_SERVICE, SSM_TOKENS.AWS_SSM, AwsSsmService],
})
export class SsmModule {}
