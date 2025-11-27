import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import {
  ICreateTaskerApplication,
  ITaskerApplication,
} from './tasker-applications.interface';
import { TaskerApplicationDocument } from '../schemas/tasker-application.schema';
import { TFilter } from '@shared/types/db-types';

export interface ITaskerApplicationRepository
  extends IBaseRepository<TaskerApplicationDocument, ICreateTaskerApplication> {
  changeStatus(id: string);

  findOneTaskerApplication(
    filter: TFilter<TaskerApplicationDocument>,
  ): Promise<ITaskerApplication | null>;
}
