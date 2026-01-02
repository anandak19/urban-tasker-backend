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

    const {
      page = this._defaultTaskersPage,
      limit = this._defaultTaskersLimit,
      sort = { rating: -1 },
    } = options;

    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          city: availQuery.city,
          workCategories: categoryObjectId,
        },
      },
      // join availability collection
      {
        $lookup: {
          from: 'availabilities',
          localField: 'userId',
          foreignField: 'taskerId',
          as: 'availability',
        },
      },
      //
      { $unwind: '$availability' },

      //filter by day , check slot
      {
        $match: {
          'availability.day': availQuery.day,
          'availability.start': { $lte: availQuery.time },
          'availability.end': { $gte: availQuery.time },
        },
      },
      // join users
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      // project
      {
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
      },
    ];

    const [result] = await this._taskerModel
      .aggregate<IFindAllAggregationResult<IListTaskers>>(pipeline)
      .exec();

    const data = result?.data ?? [];
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
}
