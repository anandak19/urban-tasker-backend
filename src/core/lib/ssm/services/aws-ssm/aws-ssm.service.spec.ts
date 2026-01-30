import { Test, TestingModule } from '@nestjs/testing';
import { AwsSsmService } from './aws-ssm.service';

describe('AwsSsmService', () => {
  let service: AwsSsmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AwsSsmService],
    }).compile();

    service = module.get<AwsSsmService>(AwsSsmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
