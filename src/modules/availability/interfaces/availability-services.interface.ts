import { IPayload } from '@modules/auth/interfaces/auth.interface';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { IMappedAvailability } from './availability.interface';

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
}
