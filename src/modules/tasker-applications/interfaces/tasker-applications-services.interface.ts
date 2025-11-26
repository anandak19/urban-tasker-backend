import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import {
  ICreateTaskerApplication,
  ITaskerApplication,
} from './tasker-applications.interface';

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
}
