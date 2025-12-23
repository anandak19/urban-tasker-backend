import { TObjectId } from '@shared/types/db-types';

export type IworkCategories = string[] | TObjectId[];

export interface ICreateTasker {
  userId: TObjectId;
  workCategories: IworkCategories;
  city: string;
  hourlyRate: string | number;
}

export interface ITasker extends ICreateTasker {
  about?: string;
  rating: number;
}

export interface IListTaskers extends Omit<ITasker, 'workCategories'> {
  firstName: string;
  lastName: string;
  profileImageUrl: string;
}
