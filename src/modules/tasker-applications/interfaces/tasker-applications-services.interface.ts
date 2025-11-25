import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { ICreateTaskerApplication } from './tasker-applications.interface';

export interface ITaskerApplicationService {
  /**
   * To create new tasker application
   * it also uploads the images in s3 and save the data in db
   * @param taskerApplication
   */
  create(taskerApplication: ICreateTaskerApplication): Promise<IBaseResponse>;
}
