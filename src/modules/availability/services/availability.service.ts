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
import { AvailabilityMapper } from '../mappers/availability.mapper';
import { IMappedAvailability } from '../interfaces/availability.interface';

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

  async findAllTaskerAvailabilities(
    userPaylod: IPayload,
  ): Promise<IMappedAvailability> {
    /**
     * TODOS
     * find all 7 availability docs of tasker by taskerId
     * map the 7 docs to construct maped data
     * return the data
     */
    try {
      const availabilityDocs =
        await this._availabilityRepo.findAllTaskerAvailabilities(userPaylod.id);

      console.log(availabilityDocs);

      return AvailabilityMapper.toListResponse(availabilityDocs);
    } catch {
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }
}
