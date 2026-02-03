import { Test, TestingModule } from '@nestjs/testing';
import { TaskerReviewController } from './tasker-review.controller';

describe('TaskerReviewController', () => {
  let controller: TaskerReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskerReviewController],
    }).compile();

    controller = module.get<TaskerReviewController>(TaskerReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
