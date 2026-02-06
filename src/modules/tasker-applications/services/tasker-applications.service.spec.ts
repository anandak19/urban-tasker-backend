import { Test, TestingModule } from '@nestjs/testing';
import { TaskerApplicationsService } from './tasker-applications.service';

describe('TaskerApplicationsService', () => {
  let service: TaskerApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskerApplicationsService],
    }).compile();

    service = module.get<TaskerApplicationsService>(TaskerApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
