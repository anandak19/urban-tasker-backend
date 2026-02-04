import { Test, TestingModule } from '@nestjs/testing';
import { TaskerReportsController } from './tasker-reports.controller';

describe('TaskerReportsController', () => {
  let controller: TaskerReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskerReportsController],
    }).compile();

    controller = module.get<TaskerReportsController>(TaskerReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
