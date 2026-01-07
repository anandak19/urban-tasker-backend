import { TaskStatus } from '@shared/constants/enums/task.enum';
import { IFindAllQuery } from '@shared/interfaces/query.interface';

export interface IListBookingsQuery extends IFindAllQuery {
  taskStatus?: TaskStatus;
}
