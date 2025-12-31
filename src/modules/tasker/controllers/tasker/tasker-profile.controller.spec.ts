import { Test, TestingModule } from '@nestjs/testing';
import { TaskerProfileController } from './tasker-profile.controller';

describe('TaskerProfileController', () => {
  let controller: TaskerProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskerProfileController],
    }).compile();

    controller = module.get<TaskerProfileController>(TaskerProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
