import { BaseRepository } from '@shared/repository/base.repository';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Tasker, TaskerDocument } from '../schemas/tasker.schema';
import { ITaskerRepository } from '../interfaces/tasker-repositories.interface';
import { ICreateTasker } from '../interfaces/tasker.interface';

export class TaskerRepository
  extends BaseRepository<TaskerDocument, ICreateTasker>
  implements ITaskerRepository
{
  constructor(
    @InjectModel(Tasker.name)
    private _taskerModel: Model<TaskerDocument>,
  ) {
    super(_taskerModel);
  }

  // sample method
  updateRating(): void {
    throw new Error('Method not implemented.');
  }
}
