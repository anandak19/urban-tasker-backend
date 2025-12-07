import { IPayload } from '@modules/auth/interfaces/auth.interface';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';

export interface IAvailabilityService {
  createDefaultAvailability(userPaylod: IPayload): Promise<IBaseResponse>;
}
