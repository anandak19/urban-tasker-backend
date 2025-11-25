import { BaseRepository } from '@shared/repository/base.repository';
import {
  TaskerApplication,
  TaskerApplicationDocument,
} from '../schemas/tasker-application.schema';
import { ICreateTaskerApplication } from '../interfaces/tasker-applications.interface';
import { ITaskerApplicationRepository } from '../interfaces/tasker-applications-repositories.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class TaskerApplicationRepository
  extends BaseRepository<TaskerApplicationDocument, ICreateTaskerApplication>
  implements ITaskerApplicationRepository
{
  constructor(
    @InjectModel(TaskerApplication.name)
    private _taskerApplicationModel: Model<TaskerApplicationDocument>,
  ) {
    super(_taskerApplicationModel);
  }

  changeStatus(id: string) {
    console.log(id);
    throw new Error('Method not implemented.');
  }
}
