import { Test, TestingModule } from '@nestjs/testing';
import { TaskerApplicationsAdminController } from './tasker-applications-admin.controller';

describe('TaskerApplicationsAdminController', () => {
  let controller: TaskerApplicationsAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskerApplicationsAdminController],
    }).compile();

    controller = module.get<TaskerApplicationsAdminController>(
      TaskerApplicationsAdminController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
