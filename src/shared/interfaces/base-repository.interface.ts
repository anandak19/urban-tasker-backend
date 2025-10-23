import { InferRawDocType, UpdateQuery } from 'mongoose';
import { FilterQuery } from 'mongoose';

export interface IBaseRepository<TDocument, TCreate> {
  findAll(): Promise<TDocument[]>;

  findById(id: string): Promise<TDocument | null>;

  findOne(
    filter: FilterQuery<InferRawDocType<TDocument>>,
  ): Promise<TDocument | null>;

  create(data: TCreate): Promise<TDocument>;

  updateById(
    id: string,
    update: UpdateQuery<InferRawDocType<TDocument>>,
  ): Promise<TDocument | null>;

  deleteOneById(id: string): Promise<TDocument | null>;
}
