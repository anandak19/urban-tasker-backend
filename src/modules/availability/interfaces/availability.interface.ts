import { TObjectId } from '@shared/types/db-types';
import { WeekDayKeys, WeekDays } from '../constants/week-days.constant';

export interface ISlot {
  start: string;
  end: string;
}

export interface ICreateAvailability {
  taskerId: string | TObjectId;
  day: WeekDays;
  slots: ISlot[];
}

export interface IAvailability extends ICreateAvailability {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// resonse shape
export type IMappedAvailability = {
  [day in WeekDayKeys]?: IAvailability;
};
