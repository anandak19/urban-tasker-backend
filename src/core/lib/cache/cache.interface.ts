export interface ICacheService {
  get<T>(key: string): Promise<T | undefined>;

  set<T>(key: string, value: T, ttl?: number | string): Promise<void>;

  delete(key: string): Promise<void>;

  getReminingTime(key: string): Promise<number | undefined>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateField<T>(key: string, field: string, value: unknown): Promise<void>;

  has(key: string): Promise<boolean>;

  clear(): Promise<void>;
}
