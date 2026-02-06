import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import {
  ICreateAvailabilitySlot,
  IGroupedSlots,
  ISlot,
} from './availability.interface';
import { AvailabilityDocument } from '../schemas/availability.schema';
import { TObjectId } from '@shared/types/db-types';

export interface IAvailabilityRepository
  extends IBaseRepository<AvailabilityDocument, ICreateAvailabilitySlot> {
  /**
   * Create / Update 7 docs representing days (sunday to saturday)
   * In each day.slots remove all slots(if present any) and insert default time slots
   * @param {string} taskerId
   * @returns {boolean} is modified count + newly inserted docs is equal to 7
   */
  createDefaultAvailabilty(taskerId: string): Promise<boolean>;

  findAllTaskerAvailabilities(
    taskerId: TObjectId | string,
  ): Promise<IGroupedSlots[]>;

  findCreateOverlap(
    slot: ISlot,
    taskerId: TObjectId | string,
  ): Promise<AvailabilityDocument | null>;

  findUpdateOverlap(
    updatedSlot: ISlot,
    availabilityId: string,
    taskerId: TObjectId | string,
  ): Promise<AvailabilityDocument | null>;

  updateSlot(availabilityId: string, updatedSlot: ISlot): Promise<boolean>;

  changeStatus(availabilityId: string, isActive: boolean): Promise<boolean>;

  /**
   * Count number of existing slots for a tasker in given day
   * @param taskerId
   * @param day?
   * @returns {number}
   */
  countTaskerExistingSlots(
    taskerId: string | TObjectId,
    day?: number,
  ): Promise<number>;

  deleteAllTaskerSlots(taskerId: string): Promise<boolean>;
}
