import { Test, TestingModule } from '@nestjs/testing';
import { TaskerBookingsController } from './tasker-bookings.controller';

describe('TaskerBookingsController', () => {
  let controller: TaskerBookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskerBookingsController],
    }).compile();

    controller = module.get<TaskerBookingsController>(TaskerBookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
