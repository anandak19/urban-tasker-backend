import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { ICreateAvailability } from './availability.interface';
import { AvailabilityDocument } from '../schemas/availability.schema';

export interface IAvailabilityRepository
  extends IBaseRepository<ICreateAvailability, AvailabilityDocument> {
  /**
   * Create / Update 7 docs representing days (sunday to saturday)
   * In each day.slots remove all slots(if present any) and insert default time slots
   * @param {string} taskerId
   * @returns {boolean} is modified count + newly inserted docs is equal to 7
   */
  createDefaultAvailabilty(taskerId: string): Promise<boolean>;
}
