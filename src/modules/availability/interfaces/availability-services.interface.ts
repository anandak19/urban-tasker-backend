import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { IMappedAvailability, ISlot } from './availability.interface';

export interface IAvailabilityService {
  /**
   * Create Default availability for tasker
   * @param userId
   */
  createDefaultAvailability(userId: string): Promise<IBaseResponse>;

  /**
   * Find all availabilities of the tasker
   * @param userPaylod
   */
  findAllTaskerAvailabilities(userId: string): Promise<IMappedAvailability>;

  deleteOneTimeSlot(availabilityId: string): Promise<IBaseResponse>;

  deleteAllTaskerSlots(taskerId: string): Promise<IBaseResponse>;

  createSlot(userId: string, slot: ISlot): Promise<IBaseResponse>;

  updateSlot(
    availabilityId: string,
    updatedSlot: ISlot,
    taskerId: string,
  ): Promise<IBaseResponse>;

  changeStatus(
    availabilityId: string,
    isActive: boolean,
  ): Promise<IBaseResponse>;
}
