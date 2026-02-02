import { BaseRepository } from '@shared/repository/base.repository';
import { Review, ReviewDocument } from '../schemas/review.schema';
import { ICreateReview } from '../interfaces/review.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { IReviewRepository } from '../interfaces/review-repositories.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { ReviewResponseDto } from '../dtos/review-response.dto';
import { toObjectId } from '@shared/utility/db/to-objectid.util';
import { IFindAllAggregationResult } from '@shared/interfaces/repository.interface';
import { IFindAllReviewsFilter } from '../interfaces/query-filters.interface';

export class ReviewRepository
  extends BaseRepository<ReviewDocument, ICreateReview>
  implements IReviewRepository
{
  constructor(
    @InjectModel(Review.name) private _reviewModel: Model<ReviewDocument>,
  ) {
    super(_reviewModel);
  }

  async findAllUserReviews(
    filter: IFindAllReviewsFilter,
  ): Promise<PaginatedResult<ReviewResponseDto>> {
    console.log(filter);

    const {
      page = this.defaultPage,
      limit = this.defaultLimit,
      taskerId,
    } = filter;

    const skip = (page - 1) * limit;

    const facetpipeline: PipelineStage.FacetPipelineStage[] = [
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $project: {
          _id: 0,
          id: { $toString: '$_id' },
          userName: {
            $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName'],
          },
          taskerId: { $toString: '$taskerId' },
          createdAt: 1,
          rating: 1,
          comment: 1,
        },
      },
    ];

    const pipeline: PipelineStage[] = [
      {
        $match: { taskerId: toObjectId(taskerId) },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          data: facetpipeline,
          total: [{ $count: 'count' }],
        },
      },
    ];

    const [result] =
      await this._reviewModel.aggregate<
        IFindAllAggregationResult<ReviewResponseDto>
      >(pipeline);

    const documents = result.data;
    const total = result?.total?.[0]?.count;

    return {
      documents: documents,
      meta: {
        limit,
        page,
        pages: Math.ceil(total / limit) || 1,
        total: total,
      },
    };
  }
}
