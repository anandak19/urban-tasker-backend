import { BaseRepository } from '@shared/repository/base.repository';
import { InferRawDocType, Model, PipelineStage, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Tasker, TaskerDocument } from '../schemas/tasker.schema';
import { ITaskerRepository } from '../interfaces/tasker-repositories.interface';
import { ICreateTasker, IListTaskers } from '../interfaces/tasker.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';
import { IAvailTaskerQuery } from '../interfaces/tasker-requests.interface';
import {
  IFindAllAggregationResult,
  IFindAllOptions,
} from '@shared/interfaces/repository.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { IOptionData } from '@shared/interfaces/response-data.interface';

export class TaskerRepository
  extends BaseRepository<TaskerDocument, ICreateTasker>
  implements ITaskerRepository
{
  private _defaultTaskersPage = 1;
  private _defaultTaskersLimit = 10;

  constructor(
    @InjectModel(Tasker.name)
    private _taskerModel: Model<TaskerDocument>,
  ) {
    super(_taskerModel);
  }

  async getTaskerWorkCategories(taskerId: string): Promise<IOptionData[]> {
    console.log(taskerId);

    const taskerObjectId = toObjectId(taskerId);
    return await this._taskerModel.aggregate([
      {
        $match: {
          userId: taskerObjectId,
        },
      },
      {
        $unwind: '$workCategories',
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'workCategories',
          foreignField: '_id',
          as: 'categories',
        },
      },
      {
        $unwind: '$categories',
      },
      {
        $project: {
          _id: 0,
          label: '$categories.name',
          id: '$categories._id',
        },
      },
    ]);
  }

  async getAvailbleTaskers(
    availQuery: IAvailTaskerQuery,
    options: IFindAllOptions = {},
  ): Promise<PaginatedResult<IListTaskers>> {
    const categoryObjectId = toObjectId(availQuery.subcategoryId);

    console.log('avail taskers query');
    console.log(availQuery);

    const {
      page = this._defaultTaskersPage,
      limit = this._defaultTaskersLimit,
      sort = { rating: -1 },
    } = options;

    const skip = (page - 1) * limit;

    // [Pipeline]
    const bookingPipeline: PipelineStage[] = [
      { $match: { city: availQuery.city, workCategories: categoryObjectId } },
    ];

    // booking stage config -- for lookup of booking collection
    const bookingLookupLet: Record<string, any> = {
      taskerId: '$userId',
      bookingCity: availQuery.city,
    };

    // booking stage config -- for lookup of booking -> expr -> and values
    const bookingLookupExprAnd = [
      { $eq: ['$city', '$$bookingCity'] },
      { $eq: ['$taskerId', '$$taskerId'] },
      { $eq: ['$isDeleted', false] },
    ];

    // [Condition] IF TIME WAS IN THE QUERY
    if (availQuery.time) {
      // [Stage 1] Availability lookup stage
      const availabilitylookupStage = {
        $lookup: {
          from: 'availabilities',
          localField: 'userId',
          foreignField: 'taskerId',
          as: 'availability',
        },
      };

      // [Stage 2] Availability unwind
      const availabilityUnwindStage = { $unwind: '$availability' };

      // [Stage 3] Availability match filter
      const availabilityMatchFilterStage = {
        $match: {
          'availability.day': availQuery.day,
          'availability.start': { $lte: availQuery.time },
          'availability.end': { $gte: availQuery.time },
        },
      };

      // [Pipeline Join]
      bookingPipeline.push(
        availabilitylookupStage,
        availabilityUnwindStage,
        availabilityMatchFilterStage,
      );

      // booking stage config -- let values
      bookingLookupLet.bookingTime = availQuery.time;

      // booking stage config -- for lookup of booking -> expr -> and values
      bookingLookupExprAnd.push({ $eq: ['$time', '$$bookingTime'] });
    }

    // [Condition] IF DATE WAS IN THE QUERY
    if (availQuery.date) {
      bookingLookupLet.bookingDate = availQuery.date;
      // booking stage config -- for lookup of booking -> expr -> and values
      bookingLookupExprAnd.push({ $eq: ['$date', '$$bookingDate'] });
    }

    // [Stage 4]: booking lookup stage
    const bookingLookupStage = {
      $lookup: {
        from: 'bookings',
        let: bookingLookupLet,
        pipeline: [
          {
            $match: {
              $expr: {
                $and: bookingLookupExprAnd,
              },
            },
          },
        ],
        as: 'conflictingBookings',
      },
    };
    // [Stage 5]: booking match filter stage
    const bookingMatchFilterStage = {
      $match: { conflictingBookings: { $eq: [] } },
    };
    // [Pipeline Join]
    bookingPipeline.push(bookingLookupStage, bookingMatchFilterStage);

    // [Stage 6]: Lookup Users Stage
    const lookupUsersStage = {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    };
    // [Stage 7]: Unwind users stage
    const unwindUsersStage = { $unwind: '$user' };
    // [Pipeline Join]
    bookingPipeline.push(lookupUsersStage, unwindUsersStage);

    // [Stage 8]: Final facet with projection stage
    const finalStage = {
      $facet: {
        data: [
          { $sort: sort },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 0,
              userId: 1,
              firstName: '$user.firstName',
              lastName: '$user.lastName',
              hourlyRate: 1,
              city: 1,
              rating: 1,
              profileImageUrl: 1,
            },
          },
        ],
        total: [{ $count: 'count' }],
      },
    };

    // [Pipeline Join]
    bookingPipeline.push(finalStage);

    const [result] = await this._taskerModel
      .aggregate<IFindAllAggregationResult<IListTaskers>>(bookingPipeline)
      .exec();

    const data = result?.data ?? [];
    console.log('data');
    console.log(data);

    const total = result?.total?.[0]?.count ?? 0;

    return {
      documents: data,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async updateByTaskerId(
    taskerId: string,
    update: UpdateQuery<InferRawDocType<TaskerDocument>>,
  ): Promise<boolean> {
    const userObjectId = toObjectId(taskerId);
    console.log('Reached repo', update);

    const result = await this._taskerModel.updateOne(
      {
        userId: userObjectId,
      },
      { $set: update },
    );
    console.log(result);

    return result.acknowledged && result.matchedCount > 0;
  }

  async addWorkCategoryByTaskerId(
    taskerId: string,
    categoryId: string,
  ): Promise<boolean> {
    const taskerObjectId = toObjectId(taskerId);
    const categoryObjectId = toObjectId(categoryId);
    console.log(taskerObjectId);
    console.log(categoryObjectId);

    const result = await this._taskerModel.updateOne(
      {
        userId: taskerObjectId,
      },
      {
        $addToSet: {
          workCategories: categoryObjectId,
        },
      },
    );

    console.log(result);

    return result.acknowledged && result.matchedCount > 0;
  }

  async removeTaskerWorkCategoryByTaskerId(
    taskerId: string,
    categoryId: string,
  ): Promise<boolean> {
    const taskerObjectId = toObjectId(taskerId);
    const categoryObjectId = toObjectId(categoryId);

    const result = await this._taskerModel.updateOne(
      { userId: taskerObjectId },
      { $pull: { workCategories: categoryObjectId } },
    );

    return result.acknowledged && result.matchedCount > 0;
  }
}
