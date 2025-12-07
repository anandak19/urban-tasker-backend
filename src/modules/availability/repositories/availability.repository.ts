import { BaseRepository } from '@shared/repository/base.repository';
import { ICreateAvailability } from '../interfaces/availability.interface';
import {
  Availability,
  AvailabilityDocument,
} from '../schemas/availability.schema';
import { IAvailabilityRepository } from '../interfaces/availability-repositories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WEEK_DAYS } from '../constants/week-days.constant';
import { DEFAULT_SLOTS } from '../constants/default-slots.constant';
import { Injectable } from '@nestjs/common';

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
    const ops = WEEK_DAYS.map((day) => ({
      updateOne: {
        filter: { taskerId, day },
        update: { $set: { taskerId, day, slots: DEFAULT_SLOTS } },
        upsert: true,
      },
    }));

    const result = await this._availabilityModel.bulkWrite(ops);

    return result.modifiedCount + result.upsertedCount === 7;
  }
}
