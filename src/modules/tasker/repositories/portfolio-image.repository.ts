import { BaseRepository } from '@shared/repository/base.repository';
import {
  PortfolioImage,
  PortfolioImageDocument,
} from '../schemas/portfolio-image.schema';
import {
  ICreatePortfolioImage,
  IPortfolioImageAggregationResult,
} from '../interfaces/portfolio-image.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { IProfileImageRepository } from '../interfaces/tasker-repositories.interface';
import { GetPortfolioFilterDto } from '../dtos/get-portfolio-filter.dto';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { toObjectId } from '@shared/utility/db/to-objectid.util';
import { IFindAllAggregationResult } from '@shared/interfaces/repository.interface';

export class PortfolioImageRepository
  extends BaseRepository<PortfolioImageDocument, ICreatePortfolioImage>
  implements IProfileImageRepository
{
  constructor(
    @InjectModel(PortfolioImage.name)
    private _portfolioImageModal: Model<PortfolioImageDocument>,
  ) {
    super(_portfolioImageModal);
  }
  async findAllImage(
    taskerId: string,
    filter: GetPortfolioFilterDto,
  ): Promise<PaginatedResult<IPortfolioImageAggregationResult>> {
    const { limit = this.defaultLimit, page = this.defaultPage } = filter;

    const skip = (page - 1) * limit;
    console.log('to find', taskerId);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: toObjectId(taskerId),
          isDeleted: false,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 0,
                id: { $toString: '$_id' },
                publicId: 1,
                caption: 1,
              },
            },
          ],
          total: [{ $count: 'count' }],
        },
      },
    ];

    const [result] =
      await this._portfolioImageModal.aggregate<
        IFindAllAggregationResult<IPortfolioImageAggregationResult>
      >(pipeline);

    const data = result?.data ?? [];
    const total = result?.total?.[0]?.count ?? 0;

    return {
      documents: data,
      meta: {
        limit,
        page,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
