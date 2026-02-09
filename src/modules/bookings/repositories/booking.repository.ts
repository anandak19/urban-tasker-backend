import { BaseRepository } from '@shared/repository/base.repository';
import { Booking, BookingDocument } from '../schemas/booking.schema';
import {
  IBookingDetailsRepoResult,
  IBookingMatchArgs,
  ICreateBooking,
  ITaskStatusGraphAggregationResult,
} from '../interfaces/bookings.interface';
import { IBookingRepository } from '../interfaces/bookings-repositories.interface';
import { InjectModel } from '@nestjs/mongoose';
import {
  AccumulatorOperator,
  ClientSession,
  FilterQuery,
  InferRawDocType,
  Model,
  PipelineStage,
} from 'mongoose';
import { toObjectId } from '@shared/utility/db/to-objectid.util';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { IFindAllAggregationResult } from '@shared/interfaces/repository.interface';
import { IListBookingsQuery } from '../interfaces/request.interface';
import { TaskStatus } from '@shared/constants/enums/task.enum';
import { PaymentStatus } from '@shared/constants/enums/payment-status.enum';
import {
  IEarningsAggregationResponse,
  IEarningsAggregationResult,
  IPopularCategoriesRepoResponse,
} from '../interfaces/repo-responses.interface';
import {
  BookingReportFilterDto,
  BookingSummaryFilter,
} from '@modules/reports/dtos/query-filters.dto';
import { BookingGroupBy } from '@modules/reports/constants/filter.enum';
import { BookingSummaryListItemDto } from '@modules/reports/dtos/bookings-summery.dto';
import { GraphDataItemDto } from '@modules/reports/dtos/graph-data.dto';
import { NonUserRoles, UserRoles } from '@shared/constants/enums/user.enum';

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

  async createBooking(payload: ICreateBooking): Promise<BookingDocument> {
    payload.categoryId = toObjectId(payload.categoryId);
    payload.subcategoryId = toObjectId(payload.subcategoryId);
    payload.taskerId = toObjectId(payload.taskerId);
    payload.userId = toObjectId(payload.userId);
    return this.create(payload);
  }

  //find all
  // needs update
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

    if (matchArgs.taskerId) {
      matchStage.taskerId = toObjectId(matchArgs.taskerId);
    }

    if (filter.taskStatus) {
      matchStage.taskStatus = filter.taskStatus;
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

                categoryName: '$subcategory.name',
                subcategoryId: { $toString: '$subcategory._id' },
                image: '$subcategory.image',

                city: 1,
                date: 1,
                time: 1,

                taskStatus: 1,
                taskSize: 1,
                isAccepted: 1,
                tskId: 1,

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

  // find one
  // needs update
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
            location: 1,

            description: 1,

            taskSize: 1,
            taskStatus: 1,
            isAccepted: 1,

            taskerId: { $toString: '$tasker._id' },
            taskerFirstName: '$tasker.firstName',
            taskerLastName: '$tasker.lastName',

            userId: { $toString: '$user._id' },
            userFirstName: '$user.firstName',
            userLastName: '$user.lastName',

            taskTimes: 1,
            payment: 1,
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

  async changePaymentStatus(
    taskId: string,
    status: PaymentStatus,
    session?: ClientSession,
  ): Promise<boolean> {
    const id = toObjectId(taskId);
    console.log(id);

    const res = await this._bookingModel.findByIdAndUpdate(
      id,
      {
        $set: { 'payment.paymentStatus': status },
      },
      { session },
    );

    return res ? true : false;
  }

  async markTaskStartTime(taskId: string, time: Date): Promise<boolean> {
    const res = await this._bookingModel.updateOne(
      { _id: toObjectId(taskId) },
      {
        $set: {
          'taskTimes.taskStartTime': time,
        },
      },
    );

    return res.acknowledged && res.modifiedCount === 1;
  }

  async markTaskEndTime(taskId: string, time: Date): Promise<boolean> {
    const res = await this._bookingModel.updateOne(
      { _id: toObjectId(taskId) },
      {
        $set: {
          'taskTimes.taskEndTime': time,
        },
      },
    );

    return res.acknowledged && res.modifiedCount === 1;
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
    console.log('reached end break repo method');

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
            'taskTimes.totalBreakTime': {
              $add: [
                { $ifNull: ['$taskTimes.totalBreakTime', 0] },
                {
                  $divide: [
                    {
                      $subtract: [
                        breakEndTime,
                        '$taskTimes.currentBreakStartTime',
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

  async finishTask(taskId: string, endTime: Date): Promise<boolean> {
    const res = await this._bookingModel.updateOne(
      { _id: toObjectId(taskId) },
      [
        {
          $set: {
            taskStatus: TaskStatus.COMPLETED,
            'taskTimes.taskEndTime': endTime,
            'taskTimes.totalTaskTime': {
              $subtract: [
                {
                  $divide: [
                    { $subtract: [endTime, '$taskTimes.taskStartTime'] },
                    1000,
                  ],
                },
                { $ifNull: ['$taskTimes.totalBreakTime', 0] },
              ],
            },
          },
        },
      ],
    );

    return res.acknowledged && res.modifiedCount === 1;
  }

  async updateAmounts(
    taskId: string,
    amount: number,
    platFormFee: number,
    subTotal: number,
  ): Promise<boolean> {
    const res = await this._bookingModel.updateOne(
      { _id: toObjectId(taskId) },
      [
        {
          $set: {
            'payment.totalAmount': amount,
            'payment.platFormFee': platFormFee,
            'payment.subTotal': subTotal,
            'payment.paymentStatus': PaymentStatus.PENDING,
          },
        },
      ],
    );

    return res.acknowledged && res.modifiedCount === 1;
  }

  async updateTipAmount(
    taskId: string,
    tipAmount: number,
    session?: ClientSession,
  ): Promise<boolean> {
    const res = await this._bookingModel.updateOne(
      { _id: toObjectId(taskId) },
      {
        $set: { 'payment.tipAmount': tipAmount },
      },
      { session },
    );

    return res.modifiedCount > 0;
  }

  async getEarningsSummery(): Promise<IEarningsAggregationResponse> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          'payment.paymentStatus': PaymentStatus.PAID,
          taskStatus: TaskStatus.COMPLETED,
        },
      },
      {
        $facet: {
          totalTasksCompleted: [{ $count: 'count' }],
          totalEarnings: [
            {
              $group: {
                _id: null,
                earnings: { $sum: '$payment.platFormFee' },
              },
            },
          ],
          totalTransactionAmount: [
            {
              $group: {
                _id: null,
                totalAmount: {
                  $sum: {
                    $add: [
                      { $ifNull: ['$payment.subTotal', 0] },
                      { $ifNull: ['$payment.tipAmount', 0] },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    ];

    const [result] =
      await this._bookingModel.aggregate<IEarningsAggregationResult>(pipeline);

    return {
      totalEarnings: result?.totalEarnings?.[0]?.earnings ?? 0,
      totalTasksCompleted: result?.totalTasksCompleted?.[0]?.count ?? 0,
      totalIncomingAmount: result.totalTransactionAmount?.[0]?.totalAmount ?? 0,
    };
  }

  async getBookingSummery(
    filter: BookingSummaryFilter,
  ): Promise<PaginatedResult<BookingSummaryListItemDto>> {
    const { page = this.defaultPage, limit = this.defaultLimit } = filter;
    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [];

    // 1. [Group]: Calculate- earnings, bookingsCount, completedCount
    const groupStage: PipelineStage.Group = {
      $group: {
        _id:
          filter.groupBy === BookingGroupBy.CATEGORY
            ? '$subcategoryId'
            : '$city',

        bookingsCount: { $sum: 1 },

        earnings: {
          $sum: {
            $cond: [
              { $eq: ['$payment.paymentStatus', PaymentStatus.PAID] },
              '$payment.platFormFee',
              0,
            ],
          },
        },

        completedCount: {
          $sum: {
            $cond: [{ $eq: ['$taskStatus', TaskStatus.COMPLETED] }, 1, 0],
          },
        },
      },
    };
    pipeline.push(groupStage);

    const facetDocsPipeline: PipelineStage.FacetPipelineStage[] = [
      { $sort: { _id: 1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const facetTotalPipeline: PipelineStage.FacetPipelineStage[] = [
      { $count: 'count' },
    ];

    // Group by category: lookup, unwind and project
    if (filter.groupBy === BookingGroupBy.CATEGORY) {
      facetDocsPipeline.push(
        {
          $lookup: {
            from: 'subcategories',
            localField: '_id',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: '$category',
        },
        {
          $project: {
            _id: 0,
            categoryName: '$category.name',
            bookingsCount: 1,
            completedCount: 1,
            earnings: 1,
          },
        },
      );
    }

    // Group by city: project
    if (filter.groupBy === BookingGroupBy.CITY) {
      facetDocsPipeline.push({
        $project: {
          _id: 0,
          city: '$_id',
          bookingsCount: 1,
          completedCount: 1,
          earnings: 1,
        },
      });
    }

    pipeline.push({
      $facet: {
        data: facetDocsPipeline,
        total: facetTotalPipeline,
      },
    });

    const [result] =
      await this._bookingModel.aggregate<
        IFindAllAggregationResult<BookingSummaryListItemDto>
      >(pipeline);

    const data = result?.data ?? [];
    const total = result?.total?.[0]?.count ?? 0;
    console.log(data);

    return {
      documents: data,
      meta: {
        limit: limit,
        page: page,
        total: total,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getGraphData(
    role: NonUserRoles = UserRoles.ADMIN,
    filter?: BookingReportFilterDto,
  ): Promise<GraphDataItemDto[]> {
    const defaultStartDate = new Date();
    defaultStartDate.setMonth(defaultStartDate.getMonth() - 10);
    defaultStartDate.setDate(1);

    const defaultEndDate = new Date();
    defaultEndDate.setMonth(defaultEndDate.getMonth() + 10);
    defaultEndDate.setDate(0);
    defaultEndDate.setHours(23, 59, 59, 999);

    const startDate: Date = filter?.startDate ?? defaultStartDate;
    let endDate: Date = filter?.endDate ?? defaultEndDate;

    // If only startDate is provided → range of 10 months
    if (filter?.startDate && !filter?.endDate) {
      endDate = new Date(filter.startDate);
      endDate.setMonth(endDate.getMonth() + 10);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
    }

    // [Accumulator for summing amount]
    let earningsCalculation: AccumulatorOperator = {
      $sum: '$payment.platFormFee',
    };
    if (role === UserRoles.TASKER) {
      earningsCalculation = {
        $sum: {
          $add: [
            '$payment.totalAmount',
            { $ifNull: ['$payment.tipAmount', 0] },
          ],
        },
      };
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          'payment.paymentStatus': PaymentStatus.PAID,
          'taskTimes.taskEndTime': {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $dateToString: {
                format: '%Y-%m',
                date: '$taskTimes.taskEndTime',
              },
            },
          },
          totalEarnings: earningsCalculation,
        },
      },
      {
        $sort: {
          '_id.month': 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          totalEarnings: 1,
        },
      },
    ];

    return await this._bookingModel.aggregate<GraphDataItemDto>(pipeline);
  }

  async getStatusGraphData(): Promise<ITaskStatusGraphAggregationResult[]> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$taskStatus',
          total: { $sum: 1 },
        },
      },
    ];

    const result =
      await this._bookingModel.aggregate<ITaskStatusGraphAggregationResult>(
        pipeline,
      );
    return result;
  }

  async getMostBookedCategories(): Promise<IPopularCategoriesRepoResponse[]> {
    const pipeline: PipelineStage[] = [
      {
        $group: {
          _id: '$subcategoryId',
          totalCount: { $sum: 1 },
        },
      },
      {
        $sort: { totalCount: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: '$categoryDetails',
      },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          name: '$categoryDetails.name',
          description: '$categoryDetails.description',
          imagePublicKey: '$categoryDetails.image',
        },
      },
    ];

    return await this._bookingModel.aggregate<IPopularCategoriesRepoResponse>(
      pipeline,
    );
  }
}
