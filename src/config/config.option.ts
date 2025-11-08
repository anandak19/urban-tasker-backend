import { ConfigModuleOptions } from '@nestjs/config';
import configuration from './configuration';

export const configOptions: ConfigModuleOptions = {
  isGlobal: true,
  load: [configuration],
  envFilePath: ['.env'],
  cache: true,
};
