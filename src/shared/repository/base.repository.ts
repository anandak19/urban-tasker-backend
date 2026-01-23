import { Logger } from '@nestjs/common';
import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import {
  IFindAllAggregationResult,
  IFindAllOptions,
} from '@shared/interfaces/repository.interface';
import { TFilter } from '@shared/types/db-types';
import {
  ClientSession,
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
    const {
      page = this._defaultPage,
      limit = this._defaultLimit,
      sort = {},
      select = {},
    } = options;

    const skip = (page - 1) * limit;

    // --- Extract search ---
    const searchText = (filter as TFilter<TDocument>)?.search as
      | string
      | undefined;
    if (searchText) delete (filter as TFilter<TDocument>).search;

    // --- Build final filter ---
    const finalFilter: FilterQuery<InferRawDocType<TDocument>> = {
      ...(filter?.isDeleted !== undefined ? {} : { isDeleted: false }),
      ...filter,
    };

    if (searchText) {
      finalFilter.$text = { $search: searchText };
    }

    this._logger.verbose('Final ');
    this._logger.log(finalFilter);

    // --- Build Pipeline ---
    const pipeline: PipelineStage[] = [
      { $match: finalFilter },
      { $sort: Object.keys(sort).length ? sort : { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: 'count' }],
        },
      },
    ];

    if (Object.keys(select).length > 0) {
      // project is more efficient BEFORE facet
      pipeline.splice(2, 0, { $project: select });
    }

    // --- Execute ---
    const [result] = await this._model
      .aggregate<IFindAllAggregationResult<TDocument>>(pipeline)
      .exec();

    const data = result?.data ?? [];
    const total = result?.total?.[0]?.count ?? 0;

    // --- Response ---
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
  async findOne(filter: TFilter<TDocument>): Promise<TDocument | null> {
    return await this._model.findOne(filter).exec();
  }

  // CREAE NEW DOC
  async create(data: TCreate, session?: ClientSession): Promise<TDocument> {
    const [doc] = await this._model.create([data], { session });
    return doc;
  }

  // UPDATE A DOC BY ID: returns updated
  async updateById(
    id: string,
    update: UpdateQuery<TDocument>,
    session?: ClientSession,
  ): Promise<TDocument | null> {
    return await this._model
      .findByIdAndUpdate(id, update, { new: true, session })
      .exec();
  }

  async updateMany(
    filter: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<boolean> {
    console.log(update);

    const result = await this._model.updateMany(filter, update);
    console.log(result);

    return result.acknowledged && result.matchedCount > 0;
  }

  async updateOneData(
    filter: FilterQuery<TDocument>,
    update: Partial<TDocument>,
  ): Promise<boolean> {
    const res = await this._model.updateOne(filter, { $set: update });
    console.log('Update base');
    console.log(res);

    return res.acknowledged && res.modifiedCount > 0;
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
