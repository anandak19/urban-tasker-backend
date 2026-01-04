import { Test, TestingModule } from '@nestjs/testing';
import { TaskerBookingService } from './tasker-booking.service';

describe('TaskerBookingService', () => {
  let service: TaskerBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskerBookingService],
    }).compile();

    service = module.get<TaskerBookingService>(TaskerBookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
