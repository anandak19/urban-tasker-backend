import { IPayload } from '@modules/auth/interfaces/auth.interface';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { IMappedAvailability, ISlot } from './availability.interface';
import { WeekDayKeys } from '../constants/week-days.constant';

export interface IAvailabilityService {
  /**
   * Create Default availability for tasker
   * @param userPaylod
   */
  createDefaultAvailability(userPaylod: IPayload): Promise<IBaseResponse>;

  /**
   * Find all availabilities of the tasker
   * @param userPaylod
   */
  findAllTaskerAvailabilities(
    userPaylod: IPayload,
  ): Promise<IMappedAvailability>;

  deleteOneTimeSlot(
    availabilityId: string,
    slotId: string,
  ): Promise<IBaseResponse>;

  createSlot(
    userPaylod: IPayload,
    day: WeekDayKeys,
    slot: ISlot,
  ): Promise<IBaseResponse>;

  updateSlot(
    availabilityId: string,
    slotId: string,
    updatedSlot: ISlot,
  ): Promise<IBaseResponse>;

  changeStatus(
    availabilityId: string,
    slotId: string,
    isDisabled: boolean,
  ): Promise<IBaseResponse>;
}
