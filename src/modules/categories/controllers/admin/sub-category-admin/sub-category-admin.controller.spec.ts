import { Test, TestingModule } from '@nestjs/testing';
import { SubCategoryAdminController } from './sub-category-admin.controller';

describe('SubCategoryAdminController', () => {
  let controller: SubCategoryAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubCategoryAdminController],
    }).compile();

    controller = module.get<SubCategoryAdminController>(SubCategoryAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
