import { Test, TestingModule } from '@nestjs/testing';
import { AdminComplaintsController } from './admin-complaints.controller';

describe('AdminComplaintsController', () => {
  let controller: AdminComplaintsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminComplaintsController],
    }).compile();

    controller = module.get<AdminComplaintsController>(AdminComplaintsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
