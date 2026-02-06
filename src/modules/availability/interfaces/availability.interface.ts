import { TObjectId } from '@shared/types/db-types';
import { WeekDayKeys } from '../constants/week-days.constant';
import { AvailabilityDocument } from '../schemas/availability.schema';

//valid
export interface ISlot {
  day: number;
  start: number;
  end: number;
}

// valid
export interface ICreateAvailabilitySlot extends ISlot {
  taskerId: TObjectId;
}

export interface IGroupedSlots {
  _id: number;
  slots: AvailabilityDocument[];
}

/**
 * taskerId
 * day
 * slots: {  start, end, day, isActive, id  }
 */

// valid
export interface IAvailabilitySlotData extends Omit<ISlot, 'start' | 'end'> {
  start: string;
  end: string;
  isActive: boolean;
  id: string;
}

// valid
export interface IAvailabilityMap extends Pick<ISlot, 'day'> {
  slots: IAvailabilitySlotData[];
}

// valid
// resonse shape
export type IMappedAvailability = {
  [day in WeekDayKeys]?: IAvailabilityMap;
};
