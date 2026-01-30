export interface ISSMService {
  getParameter(name: string): Promise<string>;

  loadFromSSM(path: string): Promise<void>;
}

export interface ISecretsManagerService {
  getJwtSecret(): Promise<string>;
}
