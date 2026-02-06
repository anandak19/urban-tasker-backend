import { BaseRepository } from '@shared/repository/base.repository';
import { Payment, PaymentDocument } from '../schemas/payment.schema';
import {
  ICreatePayment,
  IPaymentListItemRepoResult,
} from '../interfaces/payment.interface';
import { IPaymentRepository } from '../interfaces/payment-repositories.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, InferRawDocType, Model, PipelineStage } from 'mongoose';
import { ListPaymentsQueryDto } from '../dtos/query.dto';
import { IFindAllAggregationResult } from '@shared/interfaces/repository.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';

@Injectable()
export class PaymentRepository
  extends BaseRepository<PaymentDocument, ICreatePayment>
  implements IPaymentRepository
{
  constructor(
    @InjectModel(Payment.name) private _paymentModel: Model<PaymentDocument>,
  ) {
    super(_paymentModel);
  }

  async updateData(
    filter: FilterQuery<PaymentDocument>,
    update: Partial<PaymentDocument>,
  ): Promise<boolean> {
    const result = await this._paymentModel.updateOne(filter, { $set: update });

    return result.modifiedCount > 0;
  }

  async findAllPayments(
    query: ListPaymentsQueryDto,
  ): Promise<PaginatedResult<IPaymentListItemRepoResult>> {
    const matchStage: FilterQuery<InferRawDocType<PaymentDocument>> = {
      isDeleted: false,
    };
    if (query.paymentStatus) {
      matchStage.paymentStatus = query.paymentStatus;
    }

    const { page = this.defaultPage, limit = this.defaultLimit } = query;

    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $facet: {
          data: [
            {
              $sort: { createdAt: -1 },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            // payer
            {
              $lookup: {
                from: 'users',
                localField: 'payerId',
                foreignField: '_id',
                pipeline: [{ $project: { firstName: 1, lastName: 1 } }],
                as: 'payerDetails',
              },
            },
            {
              $unwind: '$payerDetails',
            },
            // receiver
            {
              $lookup: {
                from: 'users',
                localField: 'receiverId',
                foreignField: '_id',
                pipeline: [{ $project: { firstName: 1, lastName: 1 } }],
                as: 'receiverDetails',
              },
            },
            {
              $unwind: '$receiverDetails',
            },
            {
              $project: {
                amountInPaise: 1,
                razorpayPaymentId: 1,
                razorpayReceiptId: 1,
                paymentStatus: 1,
                createdAt: 1,
                tskId: 1,
                _id: 0,
                id: { $toString: '$_id' },

                senderName: {
                  $concat: [
                    '$payerDetails.firstName',
                    ' ',
                    '$payerDetails.lastName',
                  ],
                },

                receiverName: {
                  $concat: [
                    '$receiverDetails.firstName',
                    ' ',
                    '$receiverDetails.lastName',
                  ],
                },
              },
            },
          ],
          total: [{ $count: 'count' }],
        },
      },
    ];

    const [result] = await this._paymentModel
      .aggregate<
        IFindAllAggregationResult<IPaymentListItemRepoResult>
      >(pipeline)
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

  async findOnePayment(id: string): Promise<IPaymentListItemRepoResult | null> {
    const match = { _id: toObjectId(id) };

    const pipeline: PipelineStage[] = [
      {
        $match: match,
      },

      // payer
      {
        $lookup: {
          from: 'users',
          localField: 'payerId',
          foreignField: '_id',
          pipeline: [{ $project: { firstName: 1, lastName: 1 } }],
          as: 'payerDetails',
        },
      },
      {
        $unwind: '$payerDetails',
      },

      // receiver
      {
        $lookup: {
          from: 'users',
          localField: 'receiverId',
          foreignField: '_id',
          pipeline: [{ $project: { firstName: 1, lastName: 1 } }],
          as: 'receiverDetails',
        },
      },
      {
        $unwind: {
          path: '$receiverDetails',
          preserveNullAndEmptyArrays: true,
        },
      },

      // final shape
      {
        $project: {
          id: { $toString: '$_id' },

          amountInPaise: 1,
          razorpayPaymentId: 1,
          razorpayReceiptId: 1,
          paymentStatus: 1,
          createdAt: 1,
          tskId: 1,

          senderName: {
            $concat: ['$payerDetails.firstName', ' ', '$payerDetails.lastName'],
          },

          receiverName: {
            $cond: {
              if: { $ifNull: ['$receiverDetails', false] },
              then: {
                $concat: [
                  '$receiverDetails.firstName',
                  ' ',
                  '$receiverDetails.lastName',
                ],
              },
              else: 'Platform',
            },
          },

          _id: 0,
        },
      },
    ];

    const result =
      await this._paymentModel.aggregate<IPaymentListItemRepoResult>(pipeline);

    return result[0] ?? null;
  }
}
