import { Test, TestingModule } from '@nestjs/testing';
import { AuthRedisService } from './auth-redis.service';

describe('AuthRedisService', () => {
  let service: AuthRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthRedisService],
    }).compile();

    service = module.get<AuthRedisService>(AuthRedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
