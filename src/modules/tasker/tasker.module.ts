import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tasker, TaskerSchema } from './schemas/tasker.schema';
import { TASKER_TOKEN } from './tasker.token';
import { TaskerService } from './services/tasker.service';
import { TaskerRepository } from './repositories/tasker.repository';
import { TaskerController } from './controllers/user/tasker.controller';
import { TaskerProfileController } from './controllers/tasker/tasker-profile.controller';
import { UsersModule } from '@modules/users/users.module';
import {
  PortfolioImage,
  PortfolioImageSchema,
} from './schemas/portfolio-image.schema';
import { PortfolioService } from './services/portfolio/portfolio.service';
import { PortfolioImageRepository } from './repositories/portfolio-image.repository';
import { S3Module } from '@core/lib/s3/s3.module';
import { PortfolioImageController } from './controllers/tasker/portfolio/portfolio-image.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tasker.name, schema: TaskerSchema },
      { name: PortfolioImage.name, schema: PortfolioImageSchema },
    ]),
    UsersModule,
    S3Module,
  ],
  controllers: [
    TaskerController,
    TaskerProfileController,
    PortfolioImageController,
  ],
  providers: [
    {
      provide: TASKER_TOKEN.REPOSITORY,
      useClass: TaskerRepository,
    },
    {
      provide: TASKER_TOKEN.PORTFOLIO_REPOSITORY,
      useClass: PortfolioImageRepository,
    },
    {
      provide: TASKER_TOKEN.SERVICE,
      useClass: TaskerService,
    },
    {
      provide: TASKER_TOKEN.PORTFOLIO_SERVICE,
      useClass: PortfolioService,
    },
  ],
  exports: [TASKER_TOKEN.SERVICE, TASKER_TOKEN.REPOSITORY],
})
export class TaskerModule {}
