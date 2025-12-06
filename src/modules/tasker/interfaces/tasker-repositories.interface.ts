import type { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { TaskerDocument } from '../schemas/tasker.schema';
import { ICreateTasker } from './tasker.interface';

export interface ITaskerRepository
  extends IBaseRepository<TaskerDocument, ICreateTasker> {
  updateRating(): void;
}
