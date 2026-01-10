import { BaseRepository } from '@shared/repository/base.repository';
import { Booking, BookingDocument } from '../schemas/booking.schema';
import {
  IBookingDetailsRepoResult,
  IBookingMatchArgs,
  ICreateBooking,
  IListTaskersBooking,
  IListUsersBooking,
} from '../interfaces/bookings.interface';
import { IBookingRepository } from '../interfaces/bookings-repositories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, InferRawDocType, Model, PipelineStage } from 'mongoose';
import { toObjectId } from '@shared/utility/db/to-objectid.util';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { IFindAllAggregationResult } from '@shared/interfaces/repository.interface';
import { IListBookingsQuery } from '../interfaces/request.interface';
import { TaskStatus } from '@shared/constants/enums/task.enum';

export class BookingRepository
  extends BaseRepository<BookingDocument, ICreateBooking>
  implements IBookingRepository
{
  private _defaultBookingsPage = 1;
  private _defaultBookingsLimit = 10;

  constructor(
    @InjectModel(Booking.name)
    private readonly _bookingModel: Model<BookingDocument>,
  ) {
    super(_bookingModel);
  }

  // bookings for tasker
  async getAllTaskerBookings(
    taskerId: string,
    filter: IListBookingsQuery,
  ): Promise<PaginatedResult<IListTaskersBooking>> {
    const {
      page = this._defaultBookingsPage,
      limit = this._defaultBookingsLimit,
    } = filter;

    const taskerObjectId = toObjectId(taskerId);
    const skip = (page - 1) * limit;

    const matchStage: FilterQuery<InferRawDocType<BookingDocument>> = {
      taskerId: taskerObjectId,
    };

    if (filter.taskStatus) {
      matchStage.taskStatus = filter.taskStatus;
    }

    const pipeline: PipelineStage[] = [
      {
        $match: matchStage,
      },
      {
        $facet: {
          data: [
            {
              $sort: { createdAt: -1 },
            },
            { $skip: skip },
            { $limit: limit },
            // Join subcategory
            {
              $lookup: {
                from: 'subcategories',
                localField: 'subcategoryId',
                foreignField: '_id',
                as: 'subcategory',
              },
            },
            {
              $unwind: {
                path: '$subcategory',
                preserveNullAndEmptyArrays: true,
              },
            },
            // join users(users)
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'client',
              },
            },
            {
              $unwind: {
                path: '$client',
                preserveNullAndEmptyArrays: true,
              },
            },
            // Final projection
            {
              $project: {
                _id: 0,
                id: {
                  $toString: '$_id',
                },
                subcategoryId: {
                  $toString: '$subcategory._id',
                },
                categoryName: '$subcategory.name',
                image: '$subcategory.image',
                date: 1,
                time: 1,
                taskStatus: 1,
                userId: '$userId',
                isAccepted: 1,
                clientFirstName: '$client.firstName',
                clientLastName: '$client.lastName',
              },
            },
          ],
          total: [{ $count: 'count' }],
        },
      },
    ];

    const [result] = await this._bookingModel
      .aggregate<IFindAllAggregationResult<IListTaskersBooking>>(pipeline)
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

  // get all bookings of user (for user)
  async getAllBookings1(
    userId: string,
    filter: IListBookingsQuery,
  ): Promise<PaginatedResult<IListUsersBooking>> {
    const {
      page = this._defaultBookingsPage,
      limit = this._defaultBookingsLimit,
    } = filter;

    const userObjectId = toObjectId(userId);

    const skip = (page - 1) * limit;

    const matchStage: FilterQuery<InferRawDocType<BookingDocument>> = {
      userId: userObjectId,
    };

    if (filter.taskStatus) {
      matchStage.taskStatus = filter.taskStatus;
    }

    const pipeline: PipelineStage[] = [
      {
        $match: matchStage,
      },
      {
        $facet: {
          data: [
            {
              $sort: { createdAt: -1 },
            },
            { $skip: skip },
            { $limit: limit },
            // Join subcategory
            {
              $lookup: {
                from: 'subcategories',
                localField: 'subcategoryId',
                foreignField: '_id',
                as: 'subcategory',
              },
            },
            {
              $unwind: {
                path: '$subcategory',
                preserveNullAndEmptyArrays: true,
              },
            },
            // join users(taskers)
            {
              $lookup: {
                from: 'users',
                localField: 'taskerId',
                foreignField: '_id',
                as: 'tasker',
              },
            },
            {
              $unwind: {
                path: '$tasker',
                preserveNullAndEmptyArrays: true,
              },
            },
            // Final projection
            {
              $project: {
                _id: 0,
                id: {
                  $toString: '$_id',
                },
                subcategoryId: {
                  $toString: '$subcategory._id',
                },
                categoryName: '$subcategory.name',
                image: '$subcategory.image',
                date: 1,
                time: 1,
                taskerId: '$taskerId',
                taskerFirstName: '$tasker.firstName',
                taskerLastName: '$tasker.lastName',
              },
            },
          ],
          total: [{ $count: 'count' }],
        },
      },
    ];

    const [result] = await this._bookingModel
      .aggregate<IFindAllAggregationResult<IListUsersBooking>>(pipeline)
      .exec();

    console.log(result.data);
    console.log(result.total);

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

  //ut
  async getAllBookings(
    matchArgs: IBookingMatchArgs,
    filter: IListBookingsQuery,
  ): Promise<PaginatedResult<IBookingDetailsRepoResult>> {
    const {
      page = this._defaultBookingsPage,
      limit = this._defaultBookingsLimit,
    } = filter;

    console.log('filter', filter);

    const skip = (page - 1) * limit;

    /* -------- Dynamic Match Stage -------- */
    const matchStage: FilterQuery<InferRawDocType<BookingDocument>> = {};

    if (matchArgs.userId) {
      matchStage.userId = toObjectId(matchArgs.userId);
    }

    if (filter.taskStatus) {
      matchStage.taskStatus = matchArgs.taskStatus;
    }

    console.log('stagematch', matchStage);

    const pipeline: PipelineStage[] = [
      { $match: matchStage },

      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },

            /* -------- Join Subcategory -------- */
            {
              $lookup: {
                from: 'subcategories',
                localField: 'subcategoryId',
                foreignField: '_id',
                as: 'subcategory',
              },
            },
            {
              $unwind: {
                path: '$subcategory',
                preserveNullAndEmptyArrays: true,
              },
            },

            /* -------- Join Tasker -------- */
            {
              $lookup: {
                from: 'users',
                localField: 'taskerId',
                foreignField: '_id',
                as: 'tasker',
              },
            },
            {
              $unwind: {
                path: '$tasker',
                preserveNullAndEmptyArrays: true,
              },
            },

            /* -------- Join User -------- */
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
              },
            },
            {
              $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true,
              },
            },

            /* -------- Final Projection -------- */
            {
              $project: {
                _id: 0,
                id: { $toString: '$_id' },

                subcategoryId: { $toString: '$subcategory._id' },
                categoryName: '$subcategory.name',
                image: '$subcategory.image',

                date: 1,
                time: 1,
                taskStatus: 1,
                taskSize: 1,

                taskerId: { $toString: '$tasker._id' },
                taskerFirstName: '$tasker.firstName',
                taskerLastName: '$tasker.lastName',

                userId: { $toString: '$user._id' },
                userFirstName: '$user.firstName',
                userLastName: '$user.lastName',
              },
            },
          ],

          total: [{ $count: 'count' }],
        },
      },
    ];

    const [result] = await this._bookingModel
      .aggregate<IFindAllAggregationResult<IBookingDetailsRepoResult>>(pipeline)
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

  async createBooking(payload: ICreateBooking): Promise<BookingDocument> {
    payload.categoryId = toObjectId(payload.categoryId);
    payload.subcategoryId = toObjectId(payload.subcategoryId);
    payload.taskerId = toObjectId(payload.taskerId);
    payload.userId = toObjectId(payload.userId);
    return this.create(payload);
  }

  async getBookingDetailsById(
    bookingId: string,
  ): Promise<IBookingDetailsRepoResult | null> {
    const [result] =
      await this._bookingModel.aggregate<IBookingDetailsRepoResult>([
        {
          $match: {
            _id: toObjectId(bookingId),
          },
        },

        /* -------- Join Subcategory -------- */
        {
          $lookup: {
            from: 'subcategories',
            localField: 'subcategoryId',
            foreignField: '_id',
            as: 'subcategory',
          },
        },
        { $unwind: '$subcategory' },

        /* -------- Join Tasker -------- */
        {
          $lookup: {
            from: 'users',
            localField: 'taskerId',
            foreignField: '_id',
            as: 'tasker',
          },
        },
        { $unwind: '$tasker' },

        /* -------- Join User -------- */
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },

        /* -------- Final Projection -------- */
        {
          $project: {
            _id: 0,
            id: { $toString: '$_id' },

            subcategoryId: {
              $toString: '$subcategory._id',
            },
            categoryName: '$subcategory.name',
            image: '$subcategory.image',

            city: 1,
            date: 1,
            time: 1,
            description: 1,

            taskSize: 1,
            taskStatus: 1,

            taskerId: { $toString: '$tasker._id' },
            taskerFirstName: '$tasker.firstName',
            taskerLastName: '$tasker.lastName',

            userId: { $toString: '$user._id' },
            userFirstName: '$user.firstName',
            userLastName: '$user.lastName',
          },
        },
      ]);

    return result ?? null;
  }

  async changeBookingStatus(
    bookingId: string,
    status: TaskStatus,
  ): Promise<BookingDocument | null> {
    return await this.updateById(bookingId, {
      $set: { taskStatus: status },
    });
  }

  async startBreak(taskId: string, startTime: Date): Promise<boolean> {
    const res = await this._bookingModel.updateOne(
      {
        _id: toObjectId(taskId),
        'taskTimes.currentBreakStartTime': { $exists: false },
      },
      {
        $set: {
          'taskTimes.currentBreakStartTime': startTime,
        },
      },
    );

    return res.acknowledged && res.modifiedCount === 1;
  }

  async endBreak(taskId: string, breakEndTime: Date): Promise<boolean> {
    const res = await this._bookingModel.updateOne(
      {
        _id: toObjectId(taskId),
        'taskTimes.currentBreakStartTime': { $exists: true },
        'taskTimes.currentBreakEndTime': { $exists: false },
      },
      [
        {
          $set: {
            'taskTimes.currentBreakEndTime': breakEndTime,
            'tasksTimes.totalBreakTime': {
              $add: [
                'tasksTimes.totalBreakTime',
                {
                  $divide: [
                    {
                      $substract: [
                        breakEndTime,
                        'taskTimes.currentBreakStartTime',
                      ],
                    },
                    1000,
                  ],
                },
              ],
            },
          },
        },
        {
          $unset: [
            'taskTimes.currentBreakStartTime',
            'taskTimes.currentBreakEndTime',
          ],
        },
      ],
    );

    return res.acknowledged && res.modifiedCount === 1;
  }
}
