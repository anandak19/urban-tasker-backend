import { PaginatedResult } from '@shared/interfaces/query.interface';
import { ITaskerApplicationListItem } from './tasker-applications.interface';

export type IFindAllTaskerApplicationResponse =
  PaginatedResult<ITaskerApplicationListItem>;
