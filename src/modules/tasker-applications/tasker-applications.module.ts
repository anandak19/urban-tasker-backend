import { Module } from '@nestjs/common';
import { TaskerApplicationsController } from './controllers/tasker-applications.controller';
import { TASKER_APPLICATION_TOKENS } from './tasker-applications.token';
import { TaskerApplicationsService } from './services/tasker-applications.service';
import { LoggerModule } from '@core/lib/logger/logger.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TaskerApplication,
  TaskerApplicationSchema,
} from './schemas/tasker-application.schema';
import { TaskerApplicationRepository } from './repositories/tasker-applications.repository';
import { S3Module } from '@core/lib/s3/s3.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { TaskerApplicationsAdminController } from './controllers/admin/tasker-applications-admin.controller';
import { UsersModule } from '@modules/users/users.module';
// import { TokenModule } from '@modules/Token/token.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TaskerApplication.name, schema: TaskerApplicationSchema },
    ]),
    LoggerModule,
    S3Module,
    AuthModule,
    UsersModule,
    CategoriesModule,
  ],
  controllers: [
    TaskerApplicationsController,
    TaskerApplicationsAdminController,
  ],
  providers: [
    {
      provide: TASKER_APPLICATION_TOKENS.SERVICE,
      useClass: TaskerApplicationsService,
    },
    {
      provide: TASKER_APPLICATION_TOKENS.REPOSITORY,
      useClass: TaskerApplicationRepository,
    },
  ],
  exports: [],
})
export class TaskerApplicationsModule {}
