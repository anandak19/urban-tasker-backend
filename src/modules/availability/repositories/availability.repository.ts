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
import { Model } from 'mongoose';
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

  async deleteOneSlot(availabilityId: string, slot: ISlot): Promise<boolean> {
    const id = toObjectId(availabilityId);

    const result = await this._availabilityModel.updateOne(
      { _id: id },
      {
        $pull: {
          slots: {
            start: slot.start,
            end: slot.end,
          },
        },
      },
    );

    return result.modifiedCount > 0;
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
}
