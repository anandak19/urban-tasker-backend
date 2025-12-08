import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { ICreateAvailability, ISlot } from './availability.interface';
import { AvailabilityDocument } from '../schemas/availability.schema';
import { TObjectId } from '@shared/types/db-types';
import { WeekDayKeys } from '../constants/week-days.constant';

export interface IAvailabilityRepository
  extends IBaseRepository<ICreateAvailability, AvailabilityDocument> {
  /**
   * Create / Update 7 docs representing days (sunday to saturday)
   * In each day.slots remove all slots(if present any) and insert default time slots
   * @param {string} taskerId
   * @returns {boolean} is modified count + newly inserted docs is equal to 7
   */
  createDefaultAvailabilty(taskerId: string): Promise<boolean>;

  findAllTaskerAvailabilities(
    taskerId: TObjectId | string,
  ): Promise<AvailabilityDocument[]>;

  deleteOneSlot(availabilityId: string, slotId: string): Promise<boolean>;

  findOverlaps(
    taskerId: TObjectId | string,
    day: WeekDayKeys,
    slot: ISlot,
  ): Promise<AvailabilityDocument | null>;

  createSlot(
    taskerId: TObjectId,
    day: WeekDayKeys,
    slot: ISlot,
  ): Promise<AvailabilityDocument>;

  updateSlot(
    availabilityId: string,
    slotId: string,
    updatedSlot: ISlot,
  ): Promise<boolean>;
}
