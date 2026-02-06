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
import {
  ICreateAvailabilitySlot,
  IGroupedSlots,
  IMappedAvailability,
  ISlot,
} from '../interfaces/availability.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';
import { isInvalidTimes } from '@shared/utility/time/convert-time.utitlity';
import { AvailabilityMapper } from '../mappers/availability.mapper';

@Injectable()
export class AvailabilityService implements IAvailabilityService {
  private readonly MAX_SLOT = 3;

  constructor(
    @Inject(AVAILABILITY_TOKEN.AVAILABILITY_REPOSITORY)
    private _availabilityRepo: IAvailabilityRepository,
  ) {}

  async deleteAllTaskerSlots(taskerId: string): Promise<IBaseResponse> {
    const isDeletedAll =
      await this._availabilityRepo.deleteAllTaskerSlots(taskerId);

    if (!isDeletedAll) {
      throw new InternalServerErrorException(
        AVAILABILITY_ERROR.REMOVE_SLOTS_FAILED,
      );
    }

    return { message: AVAILABILITY_SUCCESS.REMOVE_ALL_SLOTS_SUCCESS };
  }

  async createDefaultAvailability(userId: string): Promise<IBaseResponse> {
    // check if any non deleted slots exists for tasker
    const existingSlotCount =
      await this._availabilityRepo.countTaskerExistingSlots(userId);

    if (existingSlotCount > 0) {
      throw new BadRequestException(
        AVAILABILITY_ERROR.REMOVE_CURRENT_SLOTS_FOR_DEFAULT,
      );
    }

    const isCreated =
      await this._availabilityRepo.createDefaultAvailabilty(userId);

    if (!isCreated) {
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }

    return { message: AVAILABILITY_SUCCESS.CREATE_DEFAULT_SUCCESS };
  }

  async findAllTaskerAvailabilities(
    userId: string,
  ): Promise<IMappedAvailability> {
    try {
      const availabilityDocs: IGroupedSlots[] =
        await this._availabilityRepo.findAllTaskerAvailabilities(userId);

      const result = AvailabilityMapper.toMappedResponse(availabilityDocs);

      return result;
    } catch {
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }

  async deleteOneTimeSlot(availabilityId: string): Promise<IBaseResponse> {
    const isDeleted =
      await this._availabilityRepo.deleteOneById(availabilityId);

    if (!isDeleted) {
      throw new InternalServerErrorException(
        AVAILABILITY_ERROR.REMOVE_SLOT_FAILD,
      );
    }

    return { message: AVAILABILITY_SUCCESS.REMOVE_SLOT_SUCCESS };
  }

  async createSlot(userId: string, slot: ISlot): Promise<IBaseResponse> {
    // check if times are invalid
    const isTimesValid = isInvalidTimes(slot.start, slot.end);
    if (isTimesValid) {
      throw new BadRequestException(AVAILABILITY_ERROR.TIME_INVALID);
    }

    const taskerId = toObjectId(userId);

    // find current slot count
    const count = await this._availabilityRepo.countTaskerExistingSlots(
      taskerId,
      slot.day,
    );

    // if existing slot count is greater or equal to max count return error
    if (count && count >= this.MAX_SLOT) {
      throw new BadRequestException(AVAILABILITY_ERROR.SLOT_MAX_ERROR);
    }

    // find if doc contains existing overlaping time slots
    const overlaps = await this._availabilityRepo.findCreateOverlap(
      slot,
      taskerId,
    );
    if (overlaps) {
      throw new BadRequestException(AVAILABILITY_ERROR.TIME_OVERLAP_ERROR);
    }

    // if availabiltiy doc is not present it just create with slot inside it, else just push the slot
    const slotPayload: ICreateAvailabilitySlot = {
      day: slot.day,
      start: slot.start,
      end: slot.end,
      taskerId,
    };
    const availabilityDoc = await this._availabilityRepo.create(slotPayload);

    if (!availabilityDoc) {
      throw new InternalServerErrorException(AVAILABILITY_ERROR.ADD_SLOT_FAILD);
    }

    return { message: AVAILABILITY_SUCCESS.ADD_SLOT_SUCCESS };
  }

  async updateSlot(
    availabilityId: string,
    updatedSlot: ISlot,
    taskerId: string,
  ): Promise<IBaseResponse> {
    // check if times are invalid
    const isTimesValid = isInvalidTimes(updatedSlot.start, updatedSlot.end);
    if (isTimesValid) {
      throw new BadRequestException(AVAILABILITY_ERROR.TIME_INVALID);
    }

    const overlaps = await this._availabilityRepo.findUpdateOverlap(
      updatedSlot,
      availabilityId,
      taskerId,
    );

    if (overlaps) {
      throw new BadRequestException(AVAILABILITY_ERROR.TIME_OVERLAP_ERROR);
    }

    //update slot
    const isUpdated = await this._availabilityRepo.updateSlot(
      availabilityId,
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
    isActive: boolean,
  ): Promise<IBaseResponse> {
    const updated = await this._availabilityRepo.changeStatus(
      availabilityId,
      isActive,
    );

    if (!updated) {
      throw new InternalServerErrorException(
        AVAILABILITY_ERROR.CHANGE_STATUS_FAILD,
      );
    }

    return { message: AVAILABILITY_SUCCESS.CHANGE_STATUS_SUCCESS };
  }
}
