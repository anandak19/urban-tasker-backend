import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ISSMService } from '../../interfaces/ssm-services.interface';
import {
  GetParameterCommand,
  GetParameterCommandOutput,
  GetParametersByPathCommand,
  SSMClient,
} from '@aws-sdk/client-ssm';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';

const AWS_REGION = 'ap-south-1';

@Injectable()
export class AwsSsmService implements ISSMService {
  // initialize ssm clinet
  private _client = new SSMClient({
    region: AWS_REGION,
  });

  async getParameter(name: string): Promise<string> {
    console.log('getting the ', name);

    const command = new GetParameterCommand({
      Name: name,
      WithDecryption: true,
    });

    const response: GetParameterCommandOutput =
      await this._client.send(command);

    console.log('as gy ', response);

    const value = response.Parameter?.Value;

    if (!value) {
      throw new InternalServerErrorException(GENERAL_ERRORS.ERROR);
    }

    return value;
  }

  async loadFromSSM(path: string): Promise<void> {
    const command = new GetParametersByPathCommand({
      Path: path,
      WithDecryption: true,
      Recursive: true,
      MaxResults: 30,
    });

    const response = await this._client.send(command);

    console.log('parameters we got');

    console.log(response);

    response.Parameters?.forEach((param) => {
      const key = param.Name?.split('/').pop();
      process.env[key!] = param.Value!;
    });
  }
}
