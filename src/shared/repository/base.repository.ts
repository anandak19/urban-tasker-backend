import { Logger } from '@nestjs/common';
import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import {
  IFindAllAggregationResult,
  IFindAllOptions,
} from '@shared/interfaces/repository.interface';
import {
  FilterQuery,
  InferRawDocType,
  Model,
  PipelineStage,
  UpdateQuery,
} from 'mongoose';

export abstract class BaseRepository<TDocument, TCreate>
  implements IBaseRepository<TDocument, TCreate>
{
  constructor(protected readonly _model: Model<TDocument>) {}
  private _logger = new Logger(BaseRepository.name);
  private _defaultPage = 1;
  private _defaultLimit = 10;

  // GET ALL DOCS : paginated, isDeleted: false
  async findAll(
    options: IFindAllOptions = {},
    filter: FilterQuery<InferRawDocType<TDocument>> = {},
  ): Promise<PaginatedResult<TDocument>> {
    // extract page and limit and sort object
    const {
      page = this._defaultPage,
      limit = this._defaultLimit,
      sort = {},
      select = {},
    } = options;

    // calculate skip
    const skip = (page - 1) * limit;
    const search = filter.search as string;

    // create final filater query
    const finalFilter: FilterQuery<InferRawDocType<TDocument>> = {
      ...(filter?.isDeleted !== undefined ? {} : { isDeleted: false }),
      ...(search ? { $text: { $search: search } } : {}),
      ...filter,
    };
    this._logger.log(finalFilter);

    // Pipeline creation
    const pipeline: PipelineStage[] = [
      { $match: finalFilter },
      { $sort: Object.keys(sort).length ? sort : { createdAt: -1 } },
    ];

    if (Object.keys(select).length > 0) {
      pipeline.push({ $project: select });
    }

    pipeline.push({
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        total: [{ $count: 'count' }],
      },
    });

    const result = await this._model
      .aggregate<IFindAllAggregationResult<TDocument>>(pipeline)
      .exec();

    const data = result[0]?.data || [];
    const total = result[0]?.total[0]?.count || 0;

    /**
     * Returns
     * data: array of result docs
     * meta: total, page, limit and pages(total pages)
     */
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

  // GET A DOC BY ID
  async findById(id: string): Promise<TDocument | null> {
    return await this._model.findById(id).exec();
  }

  // GET FIRST DOC WITH FILTER
  async findOne(
    filter: FilterQuery<InferRawDocType<TDocument>>,
  ): Promise<TDocument | null> {
    return await this._model.findOne(filter).exec();
  }

  // CREAE NEW DOC
  async create(data: TCreate): Promise<TDocument> {
    return await this._model.create(data);
  }

  // UPDATE A DOC BY ID: returns updated
  async updateById(
    id: string,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument | null> {
    return await this._model
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
  }

  // DELETE ONE DOC BY ID
  async deleteOneById(id: string): Promise<TDocument | null> {
    const deleted = await this._model
      .findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true })
      .exec();

    return deleted;
  }

  async find(
    filter: FilterQuery<InferRawDocType<TDocument>>,
  ): Promise<TDocument[] | null> {
    return await this._model.find(filter).exec();
  }
}
