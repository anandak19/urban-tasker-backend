import { PaginatedResult } from '@shared/interfaces/query.interface';
import { GetAvailableTaskersQueryDto } from '../dtos/get-available-taskers.dto';
import {
  ICreateTasker,
  IListTaskers,
  ITasker,
  ITaskerAbout,
  ITaskerCardData,
} from './tasker.interface';
import { ITaskerWorkCategoriesResponse } from './tasker-responses.interface';

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

  // To get tasker card data
  getTaskerCardData(taskerId: string): Promise<ITaskerCardData>;

  // To get about
  getTaskerAbout(taskerId: string): Promise<ITaskerAbout>;

  getTaskerWorkCategories(
    taskerId: string,
  ): Promise<ITaskerWorkCategoriesResponse>;
}
