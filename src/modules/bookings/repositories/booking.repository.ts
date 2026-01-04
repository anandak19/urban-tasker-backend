import { BaseRepository } from '@shared/repository/base.repository';
import { Booking, BookingDocument } from '../schemas/booking.schema';
import {
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
                subcategoryId: {
                  $toString: '$subcategory._id',
                },
                categoryName: '$subcategory.name',
                image: '$subcategory.image',
                date: 1,
                time: 1,
                taskStatus: 1,
                userId: '$userId',
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
  async getAllBookings(
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

  async createBooking(payload: ICreateBooking): Promise<BookingDocument> {
    payload.categoryId = toObjectId(payload.categoryId);
    payload.subcategoryId = toObjectId(payload.subcategoryId);
    payload.taskerId = toObjectId(payload.taskerId);
    payload.userId = toObjectId(payload.userId);
    return this.create(payload);
  }
}
