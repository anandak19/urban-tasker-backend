import { PaginatedResult } from '@shared/interfaces/query.interface';
import { GetAvailableTaskersQueryDto } from '../dtos/get-available-taskers.dto';
import {
  ICreateTasker,
  IListTaskers,
  ITasker,
  ITaskerAbout,
  ITaskerCardData,
} from './tasker.interface';
import { UpdateAboutDto } from '../dtos/update-about.dto';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { IOptionData } from '@shared/interfaces/response-data.interface';
import { CreatePortfolioImageDto } from '../dtos/create-portfolio-image.dto';

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

  getTaskerWorkCategories(taskerId: string): Promise<IOptionData[]>;

  updateTaskerAbout(
    taskerId: string,
    aboutData: UpdateAboutDto,
  ): Promise<IBaseResponse>;

  addTaskerWorkCategory(
    taskerId: string,
    categoryId: string,
  ): Promise<IBaseResponse>;

  removeTaskerWorkCategory(
    taskerId: string,
    categoryId: string,
  ): Promise<IBaseResponse>;
}

export interface IPortfolioImageService {
  findByTaskerId(taskerId: string);

  create(
    file: Express.Multer.File,
    dto: CreatePortfolioImageDto,
    userId: string,
  ): Promise<IBaseResponse>;
}
