import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tasker, TaskerSchema } from './schemas/tasker.schema';
import { TASKER_TOKEN } from './tasker.token';
import { TaskerService } from './services/tasker.service';
import { TaskerRepository } from './repositories/tasker.repository';
import { TaskerController } from './controllers/user/tasker.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tasker.name, schema: TaskerSchema }]),
  ],
  controllers: [TaskerController],
  providers: [
    {
      provide: TASKER_TOKEN.REPOSITORY,
      useClass: TaskerRepository,
    },
    {
      provide: TASKER_TOKEN.SERVICE,
      useClass: TaskerService,
    },
  ],
  exports: [TASKER_TOKEN.SERVICE],
})
export class TaskerModule {}
