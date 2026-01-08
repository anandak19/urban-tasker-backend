import { Test, TestingModule } from '@nestjs/testing';
import { AdminBookingsController } from './admin-bookings.controller';

describe('AdminBookingsController', () => {
  let controller: AdminBookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminBookingsController],
    }).compile();

    controller = module.get<AdminBookingsController>(AdminBookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
