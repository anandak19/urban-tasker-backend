import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { FilterQuery, InferRawDocType, Model, UpdateQuery } from 'mongoose';

export abstract class BaseRepository<TDocument, TCreate>
  implements IBaseRepository<TDocument, TCreate>
{
  constructor(protected readonly _model: Model<TDocument>) {}

  // GET ALL DOCS : isDeleted: false
  async findAll(): Promise<TDocument[]> {
    return await this._model.find({ isDeleted: { $ne: true } }).exec();
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
