import { Test, TestingModule } from '@nestjs/testing';
import { SocketAuthService } from './socket-auth.service';

describe('SocketAuthService', () => {
  let service: SocketAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketAuthService],
    }).compile();

    service = module.get<SocketAuthService>(SocketAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
