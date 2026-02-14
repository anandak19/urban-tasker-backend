import { Test, TestingModule } from '@nestjs/testing';
import { BookingsCommonController } from './bookings-common.controller';

describe('BookingsCommonController', () => {
  let controller: BookingsCommonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsCommonController],
    }).compile();

    controller = module.get<BookingsCommonController>(BookingsCommonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
