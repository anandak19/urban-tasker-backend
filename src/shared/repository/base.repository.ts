import { Logger } from '@nestjs/common';
import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import {
  IPaginationQuery,
  PaginatedResult,
} from '@shared/interfaces/query.interface';
import { FilterQuery, InferRawDocType, Model, UpdateQuery } from 'mongoose';

export abstract class BaseRepository<TDocument, TCreate>
  implements IBaseRepository<TDocument, TCreate>
{
  constructor(protected readonly _model: Model<TDocument>) {}
  private _logger = new Logger(BaseRepository.name);
  private _defaultPage = 1;
  private _defaultLimit = 10;

  // GET ALL DOCS : paginated, isDeleted: false
  async findAll(
    paginationDto: IPaginationQuery = {
      page: this._defaultPage,
      limit: this._defaultLimit,
    },
    filter: FilterQuery<InferRawDocType<TDocument>> = {},
  ): Promise<PaginatedResult<TDocument>> {
    // extract page and limit --has default
    const { page = this._defaultPage, limit = this._defaultLimit } =
      paginationDto;

    // calculate skip
    const skip = (page - 1) * limit;

    // create final filater query
    const finalFilter: FilterQuery<InferRawDocType<TDocument>> = {
      ...(filter?.isDeleted !== undefined ? {} : { isDeleted: false }),
      ...filter,
    };
    this._logger.log(finalFilter);

    // get data and total document
    const [data, total] = await Promise.all([
      this._model.find(finalFilter).skip(skip).limit(limit).exec(),
      this._model.countDocuments(finalFilter).exec(),
    ]);

    return {
      data,
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

  // UPDATE A DOC BY ID
  async updateById(
    id: string,
    update: UpdateQuery<InferRawDocType<TDocument>>,
  ): Promise<TDocument | null> {
    return await this._model
      .findByIdAndUpdate(id, { update }, { new: true })
      .exec();
  }

  // DELETE ONE DOC BY ID
  async deleteOneById(id: string): Promise<TDocument | null> {
    const deleted = await this._model
      .findByIdAndUpdate(id, { $set: { isDeleted: true } }, { new: true })
      .exec();

    return deleted;
  }
}
