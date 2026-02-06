import { Test, TestingModule } from '@nestjs/testing';
import { TaskerReportService } from './tasker-report.service';

describe('TaskerReportService', () => {
  let service: TaskerReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskerReportService],
    }).compile();

    service = module.get<TaskerReportService>(TaskerReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
