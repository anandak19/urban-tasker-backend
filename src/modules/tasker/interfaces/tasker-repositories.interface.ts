import type { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { TaskerDocument } from '../schemas/tasker.schema';
import { ICreateTasker, IListTaskers } from './tasker.interface';
import { IAvailTaskerQuery } from './tasker-requests.interface';
import { IFindAllOptions } from '@shared/interfaces/repository.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';

export interface ITaskerRepository
  extends IBaseRepository<TaskerDocument, ICreateTasker> {
  updateRating(): void;

  getAvailbleTaskers(
    availQuery: IAvailTaskerQuery,
    options: IFindAllOptions,
  ): Promise<PaginatedResult<IListTaskers>>;
}
