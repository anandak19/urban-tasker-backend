import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioImageController } from './portfolio-image.controller';

describe('PortfolioImageController', () => {
  let controller: PortfolioImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortfolioImageController],
    }).compile();

    controller = module.get<PortfolioImageController>(PortfolioImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
