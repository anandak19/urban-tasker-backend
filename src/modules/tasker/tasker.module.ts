import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tasker, TaskerSchema } from './schemas/tasker.schema';
import { TASKER_TOKEN } from './tasker.token';
import { TaskerService } from './services/tasker.service';
import { TaskerRepository } from './repositories/tasker.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tasker.name, schema: TaskerSchema }]),
  ],
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
