import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IAvailabilityService } from '../interfaces/availability-services.interface';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { AVAILABILITY_TOKEN } from '../availability.token';
import type { IAvailabilityRepository } from '../interfaces/availability-repositories.interface';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { AVAILABILITY_SUCCESS } from '@shared/constants/messages/availability-messages.constants';
import { IPayload } from '@modules/auth/interfaces/auth.interface';

@Injectable()
export class AvailabilityService implements IAvailabilityService {
  constructor(
    @Inject(AVAILABILITY_TOKEN.AVAILABILITY_REPOSITORY)
    private _availabilityRepo: IAvailabilityRepository,
  ) {}

  async createDefaultAvailability(
    userPaylod: IPayload,
  ): Promise<IBaseResponse> {
    try {
      const isCreated = await this._availabilityRepo.createDefaultAvailabilty(
        userPaylod.id,
      );

      if (!isCreated) {
        throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
      }

      return { message: AVAILABILITY_SUCCESS.CREATE_DEFAULT_SUCCESS };
    } catch {
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }
}
