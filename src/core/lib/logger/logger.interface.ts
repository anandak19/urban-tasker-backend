export interface ILoggerService {
  log(message: string | object): void;
  error(message: string): void;
  warn(message: string): void;
  verbose(message: string): void;
}
