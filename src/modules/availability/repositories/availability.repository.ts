import { BaseRepository } from '@shared/repository/base.repository';
import {
  ICreateAvailabilitySlot,
  IGroupedSlots,
  ISlot,
} from '../interfaces/availability.interface';
import {
  Availability,
  AvailabilityDocument,
} from '../schemas/availability.schema';
import { IAvailabilityRepository } from '../interfaces/availability-repositories.interface';
import { InjectModel } from '@nestjs/mongoose';
import {
  AnyBulkWriteOperation,
  FilterQuery,
  Model,
  PipelineStage,
} from 'mongoose';
import { DEFAULT_SLOTS } from '../constants/default-slots.constant';
import { Injectable } from '@nestjs/common';
import { TObjectId } from '@shared/types/db-types';
import { toObjectId } from '@shared/utility/db/to-objectid.util';

@Injectable()
export class AvailabilityRepository
  extends BaseRepository<AvailabilityDocument, ICreateAvailabilitySlot>
  implements IAvailabilityRepository
{
  constructor(
    @InjectModel(Availability.name)
    private _availabilityModel: Model<AvailabilityDocument>,
  ) {
    super(_availabilityModel);
  }

  async deleteAllTaskerSlots(taskerId: string): Promise<boolean> {
    const taskerObjectId = toObjectId(taskerId);

    const result = await this._availabilityModel.updateMany(
      { taskerId: taskerObjectId, isDeleted: false },
      { $set: { isDeleted: true } },
    );

    return result.modifiedCount > 0;
  }

  async createDefaultAvailabilty(taskerId: string): Promise<boolean> {
    const taskerObjectId = toObjectId(taskerId);

    const bulkOps: AnyBulkWriteOperation<Availability>[] = DEFAULT_SLOTS.map(
      (slot) => ({
        insertOne: {
          document: {
            taskerId: taskerObjectId,
            day: slot.day,
            start: slot.start,
            end: slot.end,
            isActive: true,
            isDeleted: false,
          },
        },
      }),
    );

    const result = await this._availabilityModel.bulkWrite(bulkOps);

    return result.insertedCount === DEFAULT_SLOTS.length;
  }

  async findAllTaskerAvailabilities(
    taskerId: TObjectId | string,
  ): Promise<IGroupedSlots[]> {
    const taskerObjectId = toObjectId(taskerId);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          taskerId: taskerObjectId,
          isDeleted: false,
        },
      },
      {
        $sort: {
          day: 1,
          start: 1,
        },
      },
      {
        $group: {
          _id: '$day',
          slots: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ];

    return await this._availabilityModel.aggregate(pipeline);
  }

  async findUpdateOverlap(
    updatedSlot: ISlot,
    availabilityId: string,
    taskerId: TObjectId | string,
  ): Promise<AvailabilityDocument | null> {
    // find update overlap
    const availabilityObjectId = toObjectId(availabilityId);
    const taskerObjectId = toObjectId(taskerId);

    const filter: FilterQuery<AvailabilityDocument> = {
      taskerId: taskerObjectId,
      isDeleted: false,
      day: updatedSlot.day,
    };

    return await this.findOverlap(filter, updatedSlot, availabilityObjectId);
  }

  async findCreateOverlap(
    slot: ISlot,
    taskerId: TObjectId | string,
  ): Promise<AvailabilityDocument | null> {
    // find crete overlap
    const taskerObjectId = toObjectId(taskerId);

    const filter: FilterQuery<AvailabilityDocument> = {
      taskerId: taskerObjectId,
      isDeleted: false,
      day: slot.day,
    };

    return await this.findOverlap(filter, slot);
  }

  async updateSlot(
    availabilityId: string,
    updatedSlot: ISlot,
  ): Promise<boolean> {
    const availabilityObjectId = toObjectId(availabilityId);
    const result = await this._availabilityModel.updateOne(
      {
        _id: availabilityObjectId,
      },
      {
        $set: {
          start: updatedSlot.start,
          end: updatedSlot.end,
        },
      },
    );

    return result.matchedCount > 0 && result.modifiedCount > 0;
  }

  async changeStatus(
    availabilityId: string,
    isActive: boolean,
  ): Promise<boolean> {
    const availabilityObjectId = toObjectId(availabilityId);
    const result = await this._availabilityModel.updateOne(
      {
        _id: availabilityObjectId,
      },
      {
        $set: {
          isActive: isActive,
        },
      },
    );

    return result.matchedCount > 0 && result.modifiedCount > 0;
  }

  async countTaskerExistingSlots(
    taskerId: string | TObjectId,
    day?: number,
  ): Promise<number> {
    const taskerObjectId = toObjectId(taskerId);

    const query: FilterQuery<AvailabilityDocument> = {
      taskerId: taskerObjectId,
      isDeleted: false,
    };

    if (day) {
      query.day = day;
    }

    return await this._availabilityModel.countDocuments(query);
  }

  // private methods
  private findOverlap(
    filter: FilterQuery<AvailabilityDocument>,
    slot: ISlot,
    availabilityId?: TObjectId,
  ): Promise<AvailabilityDocument | null> {
    const query: FilterQuery<AvailabilityDocument> = {
      ...filter,

      start: { $lt: slot.end },
      end: { $gt: slot.start },
    };

    if (availabilityId) {
      query._id = { $ne: availabilityId };
    }

    console.log('Query to check overlap');
    console.log(query);

    return this._availabilityModel.findOne(query);
  }
}
