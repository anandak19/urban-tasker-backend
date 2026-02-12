import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import {
  ICreateTaskerApplication,
  ITaskerApplication,
} from './tasker-applications.interface';
import { TaskerApplicationDocument } from '../schemas/tasker-application.schema';
import { TFilter } from '@shared/types/db-types';
import {
  IFindAllQuery,
  PaginatedResult,
} from '@shared/interfaces/query.interface';

export interface ITaskerApplicationRepository
  extends IBaseRepository<TaskerApplicationDocument, ICreateTaskerApplication> {
  findOneTaskerApplication(
    filter: TFilter<TaskerApplicationDocument>,
  ): Promise<ITaskerApplication | null>;

  findAllApplications(
    query: IFindAllQuery,
  ): Promise<PaginatedResult<TaskerApplicationDocument>>;
}
