import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IAvailabilityService } from '../interfaces/availability-services.interface';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { AVAILABILITY_TOKEN } from '../availability.token';
import type { IAvailabilityRepository } from '../interfaces/availability-repositories.interface';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import {
  AVAILABILITY_ERROR,
  AVAILABILITY_SUCCESS,
} from '@shared/constants/messages/availability-messages.constants';
import { IPayload } from '@modules/auth/interfaces/auth.interface';
import { AvailabilityMapper } from '../mappers/availability.mapper';
import {
  IMappedAvailability,
  ISlot,
} from '../interfaces/availability.interface';
import { WeekDayKeys } from '../constants/week-days.constant';
import { toObjectId } from '@shared/utility/db/to-objectid.util';

@Injectable()
export class AvailabilityService implements IAvailabilityService {
  constructor(
    @Inject(AVAILABILITY_TOKEN.AVAILABILITY_REPOSITORY)
    private _availabilityRepo: IAvailabilityRepository,
  ) {}

  private readonly MAX_SLOT = 3;

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

  async deleteOneTimeSlot(
    availabilityId: string,
    slot: ISlot,
  ): Promise<IBaseResponse> {
    try {
      const isDeleted = await this._availabilityRepo.deleteOneSlot(
        availabilityId,
        slot,
      );

      if (!isDeleted) {
        throw new InternalServerErrorException(
          AVAILABILITY_ERROR.REMOVE_SLOT_FAILD,
        );
      }

      return { message: AVAILABILITY_SUCCESS.REMOVE_SLOT_SUCCESS };
    } catch {
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  async createSlot(
    userPaylod: IPayload,
    day: WeekDayKeys,
    slot: ISlot,
  ): Promise<IBaseResponse> {
    try {
      const taskerId = toObjectId(userPaylod.id);

      const existingDoc = await this._availabilityRepo.findOne({
        taskerId,
        day,
      });

      if (existingDoc && existingDoc.slots.length >= this.MAX_SLOT) {
        throw new BadRequestException(AVAILABILITY_ERROR.ADD_SLOT_FAILD);
      }

      const availabilityDoc = await this._availabilityRepo.createSlot(
        taskerId,
        day,
        slot,
      );

      if (!availabilityDoc) {
        throw new InternalServerErrorException(
          AVAILABILITY_ERROR.ADD_SLOT_FAILD,
        );
      }

      return { message: AVAILABILITY_SUCCESS.ADD_SLOT_SUCCESS };
    } catch {
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }
}
