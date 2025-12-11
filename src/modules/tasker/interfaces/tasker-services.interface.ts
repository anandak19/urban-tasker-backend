import { ICreateTasker, ITasker } from './tasker.interface';

export interface ITaskerService {
  /**
   * Create a new tasker
   * @param {ICreateTasker} taskerData
   * @returns {Promise<ITasker>} newTaskerData
   */
  create(taskerData: ICreateTasker): Promise<ITasker>;
}
