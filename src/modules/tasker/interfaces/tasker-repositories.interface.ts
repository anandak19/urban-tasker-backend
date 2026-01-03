import type { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { TaskerDocument } from '../schemas/tasker.schema';
import { ICreateTasker, IListTaskers } from './tasker.interface';
import { IAvailTaskerQuery } from './tasker-requests.interface';
import { IFindAllOptions } from '@shared/interfaces/repository.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { InferRawDocType, UpdateQuery } from 'mongoose';
import { IOptionData } from '@shared/interfaces/response-data.interface';

export interface ITaskerRepository
  extends IBaseRepository<TaskerDocument, ICreateTasker> {
  getAvailbleTaskers(
    availQuery: IAvailTaskerQuery,
    options: IFindAllOptions,
  ): Promise<PaginatedResult<IListTaskers>>;

  getTaskerWorkCategories(taskerId: string): Promise<IOptionData[]>;

  updateByTaskerId(
    taskerId: string,
    update: UpdateQuery<InferRawDocType<TaskerDocument>>,
  ): Promise<boolean>;

  addWorkCategoryByTaskerId(
    taskerId: string,
    categoryId: string,
  ): Promise<boolean>;

  removeTaskerWorkCategoryByTaskerId(
    taskerId: string,
    categoryId: string,
  ): Promise<boolean>;
}
