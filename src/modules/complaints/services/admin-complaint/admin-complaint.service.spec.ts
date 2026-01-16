import { Test, TestingModule } from '@nestjs/testing';
import { AdminComplaintService } from './admin-complaint.service';

describe('AdminComplaintService', () => {
  let service: AdminComplaintService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminComplaintService],
    }).compile();

    service = module.get<AdminComplaintService>(AdminComplaintService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
