import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { ICreateTaskerApplication } from './tasker-applications.interface';
import { TaskerApplicationDocument } from '../schemas/tasker-application.schema';

export interface ITaskerApplicationRepository
  extends IBaseRepository<TaskerApplicationDocument, ICreateTaskerApplication> {
  changeStatus(id: string);
}
