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
import { isInvalidTimes } from '@shared/utility/time/convert-time.utitlity';

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
    try {
      const availabilityDocs =
        await this._availabilityRepo.findAllTaskerAvailabilities(userPaylod.id);

      return AvailabilityMapper.toListResponse(availabilityDocs);
    } catch {
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  async deleteOneTimeSlot(
    availabilityId: string,
    slotId: string,
  ): Promise<IBaseResponse> {
    const isDeleted = await this._availabilityRepo.deleteOneSlot(
      availabilityId,
      slotId,
    );

    if (!isDeleted) {
      throw new InternalServerErrorException(
        AVAILABILITY_ERROR.REMOVE_SLOT_FAILD,
      );
    }

    return { message: AVAILABILITY_SUCCESS.REMOVE_SLOT_SUCCESS };
  }

  async createSlot(
    userPaylod: IPayload,
    day: WeekDayKeys,
    slot: ISlot,
  ): Promise<IBaseResponse> {
    // check if times are invalid
    const isTimesValid = isInvalidTimes(slot.start, slot.end);
    if (isTimesValid) {
      throw new BadRequestException(AVAILABILITY_ERROR.TIME_INVALID);
    }

    const taskerId = toObjectId(userPaylod.id);

    // find existing doc? and check if time slot are at maximum
    const existingDoc = await this._availabilityRepo.findOne({
      taskerId,
      day,
    });
    if (existingDoc && existingDoc.slots.length >= this.MAX_SLOT) {
      throw new BadRequestException(AVAILABILITY_ERROR.SLOT_MAX_ERROR);
    }

    // find if doc contains existing overlaping time slots
    const overlaps = await this._availabilityRepo.findCreateOverlap(
      slot,
      taskerId,
      day,
    );
    if (overlaps) {
      throw new BadRequestException(AVAILABILITY_ERROR.TIME_OVERLAP_ERROR);
    }

    // if availabiltiy doc is not present it just create with slot inside it, else just push the slot
    const availabilityDoc = await this._availabilityRepo.createSlot(
      taskerId,
      day,
      slot,
    );

    if (!availabilityDoc) {
      throw new InternalServerErrorException(AVAILABILITY_ERROR.ADD_SLOT_FAILD);
    }

    return { message: AVAILABILITY_SUCCESS.ADD_SLOT_SUCCESS };
  }

  async updateSlot(
    availabilityId: string,
    slotId: string,
    updatedSlot: ISlot,
  ): Promise<IBaseResponse> {
    // check if times are invalid
    const isTimesValid = isInvalidTimes(updatedSlot.start, updatedSlot.end);
    if (isTimesValid) {
      throw new BadRequestException(AVAILABILITY_ERROR.TIME_INVALID);
    }

    const overlaps = await this._availabilityRepo.findUpdateOverlap(
      updatedSlot,
      availabilityId,
      slotId,
    );

    if (overlaps) {
      throw new BadRequestException(AVAILABILITY_ERROR.TIME_OVERLAP_ERROR);
    }

    //update slot
    const isUpdated = await this._availabilityRepo.updateSlot(
      availabilityId,
      slotId,
      updatedSlot,
    );

    if (!isUpdated) {
      throw new InternalServerErrorException(
        AVAILABILITY_ERROR.UPDATE_SLOT_FAILD,
      );
    }

    return { message: AVAILABILITY_SUCCESS.UPDATE_SLOT_SUCCESS };
  }

  async changeStatus(
    availabilityId: string,
    slotId: string,
    isDisabled: boolean,
  ): Promise<IBaseResponse> {
    const updated = await this._availabilityRepo.changeStatus(
      availabilityId,
      slotId,
      isDisabled,
    );

    if (!updated) {
      throw new InternalServerErrorException(
        AVAILABILITY_ERROR.CHANGE_STATUS_FAILD,
      );
    }

    return { message: AVAILABILITY_SUCCESS.CHANGE_STATUS_SUCCESS };
  }
}
