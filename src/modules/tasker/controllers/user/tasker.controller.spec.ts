import { Test, TestingModule } from '@nestjs/testing';
import { TaskerController } from './tasker.controller';

describe('TaskerController', () => {
  let controller: TaskerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskerController],
    }).compile();

    controller = module.get<TaskerController>(TaskerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
