import { BaseRepository } from '@shared/repository/base.repository';
import {
  ICreateAvailability,
  ISlot,
} from '../interfaces/availability.interface';
import {
  Availability,
  AvailabilityDocument,
} from '../schemas/availability.schema';
import { IAvailabilityRepository } from '../interfaces/availability-repositories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { WEEK_DAYS, WeekDayKeys } from '../constants/week-days.constant';
import { DEFAULT_SLOTS } from '../constants/default-slots.constant';
import { Injectable } from '@nestjs/common';
import { TObjectId } from '@shared/types/db-types';
import { toObjectId } from '@shared/utility/db/to-objectid.util';

@Injectable()
export class AvailabilityRepository
  extends BaseRepository<AvailabilityDocument, ICreateAvailability>
  implements IAvailabilityRepository
{
  constructor(
    @InjectModel(Availability.name)
    private _availabilityModel: Model<AvailabilityDocument>,
  ) {
    super(_availabilityModel);
  }

  async createDefaultAvailabilty(taskerId: string): Promise<boolean> {
    const taskerObjectId = toObjectId(taskerId);
    const ops = WEEK_DAYS.map((day) => ({
      updateOne: {
        filter: { taskerId: taskerObjectId, day },
        update: {
          $set: { taskerId: taskerObjectId, day, slots: DEFAULT_SLOTS },
        },
        upsert: true,
      },
    }));

    const result = await this._availabilityModel.bulkWrite(ops);

    return result.modifiedCount + result.upsertedCount === 7;
  }

  async findAllTaskerAvailabilities(
    taskerId: TObjectId | string,
  ): Promise<AvailabilityDocument[]> {
    const taskerObjectId = toObjectId(taskerId);

    return await this._availabilityModel.find({ taskerId: taskerObjectId });
  }

  async deleteOneSlot(
    availabilityId: string,
    slotId: string,
  ): Promise<boolean> {
    const availabilityObjectId = toObjectId(availabilityId);
    const slotObjectId = toObjectId(slotId);

    const result = await this._availabilityModel.updateOne(
      { _id: availabilityObjectId },
      {
        $pull: {
          slots: {
            _id: slotObjectId,
          },
        },
      },
    );

    return result.modifiedCount > 0;
  }

  async findUpdateOverlap(
    updatedSlot: ISlot,
    availabilityId: string,
    slotId: string,
  ): Promise<AvailabilityDocument | null> {
    // find update overlap
    const availabilityObjectId = toObjectId(availabilityId);
    const slotObjectId = toObjectId(slotId);

    const filter: FilterQuery<AvailabilityDocument> = {
      _id: availabilityObjectId,
    };

    return await this.findOverlap(filter, updatedSlot, slotObjectId);
  }

  async findCreateOverlap(
    slot: ISlot,
    taskerId: TObjectId | string,
    day: WeekDayKeys,
  ): Promise<AvailabilityDocument | null> {
    // find crete overlap
    const taskerObjectId = toObjectId(taskerId);

    const filter: FilterQuery<AvailabilityDocument> = {
      taskerId: taskerObjectId,
      day,
    };

    return await this.findOverlap(filter, slot);
  }

  async createSlot(
    taskerId: TObjectId,
    day: WeekDayKeys,
    slot: ISlot,
  ): Promise<AvailabilityDocument> {
    return this._availabilityModel.findOneAndUpdate(
      { taskerId, day },
      {
        $setOnInsert: { taskerId, day },
        $push: { slots: slot },
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async updateSlot(
    availabilityId: string,
    slotId: string,
    updatedSlot: ISlot,
  ): Promise<boolean> {
    const availabilityObjectId = toObjectId(availabilityId);
    const slotObjectId = toObjectId(slotId);
    const result = await this._availabilityModel.updateOne(
      {
        _id: availabilityObjectId,
        'slots._id': slotObjectId,
      },
      {
        $set: {
          'slots.$.start': updatedSlot.start,
          'slots.$.end': updatedSlot.end,
        },
      },
    );

    return result.matchedCount > 0 && result.modifiedCount > 0;
  }

  async changeStatus(
    availabilityId: string,
    slotId: string,
    isDisabled: boolean,
  ): Promise<boolean> {
    const availabilityObjectId = toObjectId(availabilityId);
    const slotObjectId = toObjectId(slotId);
    const result = await this._availabilityModel.updateOne(
      {
        _id: availabilityObjectId,
        'slots._id': slotObjectId,
      },
      {
        $set: {
          'slots.$.isDisabled': isDisabled,
        },
      },
    );

    return result.matchedCount > 0 && result.modifiedCount > 0;
  }

  private findOverlap(
    filter: FilterQuery<AvailabilityDocument>,
    slot: ISlot,
    slotId?: TObjectId,
  ): Promise<AvailabilityDocument | null> {
    const matchSlot: FilterQuery<AvailabilityDocument> = {
      $or: [
        {
          start: { $lte: slot.start },
          end: { $gt: slot.start },
        },
        {
          start: { $lt: slot.end },
          end: { $gte: slot.end },
        },
        {
          start: { $gte: slot.start },
          end: { $lte: slot.end },
        },
      ],
    };

    if (slotId) {
      matchSlot._id = { $ne: slotId };
    }

    return this._availabilityModel.findOne({
      ...filter,
      slots: {
        $elemMatch: matchSlot,
      },
    });
  }
}
