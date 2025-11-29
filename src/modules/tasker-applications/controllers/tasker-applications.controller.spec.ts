import { Test, TestingModule } from '@nestjs/testing';
import { TaskerApplicationsController } from './tasker-applications.controller';

describe('TaskerApplicationsController', () => {
  let controller: TaskerApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskerApplicationsController],
    }).compile();

    controller = module.get<TaskerApplicationsController>(TaskerApplicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
