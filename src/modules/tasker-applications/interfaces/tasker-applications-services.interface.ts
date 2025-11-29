import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import {
  IApplicationStatusInfo,
  ICreateTaskerApplication,
  ITaskerApplication,
} from './tasker-applications.interface';
import { IFindAllTaskerApplicationResponse } from './api-responses.interface';
import { IFindAllQuery } from '@shared/interfaces/query.interface';

export interface ITaskerApplicationService {
  /**
   * To create new tasker application
   * it also uploads the images in s3 and save the data in db
   * @param taskerApplication
   */
  create(taskerApplication: ICreateTaskerApplication): Promise<IBaseResponse>;

  /**
   * Gets tasker application of logged in user
   * @param userId
   */
  getLoggedInUsersApplication(userId: string): Promise<ITaskerApplication>;

  findAll(query: IFindAllQuery): Promise<IFindAllTaskerApplicationResponse>;

  findById(id: string): Promise<ITaskerApplication>;

  updateStatus(
    applicationId: string,
    statusInfo: IApplicationStatusInfo,
  ): Promise<IBaseResponse>;
}
