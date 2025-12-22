import { PaginatedResult } from '@shared/interfaces/query.interface';
import { GetAvailableTaskersQueryDto } from '../dtos/get-available-taskers.dto';
import { ICreateTasker, IListTaskers, ITasker } from './tasker.interface';

export interface ITaskerService {
  /**
   * Create a new tasker
   * @param {ICreateTasker} taskerData
   * @returns {Promise<ITasker>} newTaskerData
   */
  create(taskerData: ICreateTasker): Promise<ITasker>;

  getAvailbleTaskers(
    availQuery: GetAvailableTaskersQueryDto,
  ): Promise<PaginatedResult<IListTaskers>>;
}
