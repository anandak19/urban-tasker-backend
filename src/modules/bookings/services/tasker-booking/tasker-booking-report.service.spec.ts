import { Test, TestingModule } from '@nestjs/testing';
import { TaskerBookingReportService } from './tasker-booking-report.service';

describe('TaskerBookingReportService', () => {
  let service: TaskerBookingReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskerBookingReportService],
    }).compile();

    service = module.get<TaskerBookingReportService>(TaskerBookingReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
