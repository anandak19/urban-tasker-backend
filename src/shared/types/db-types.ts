import mongoose, { FilterQuery, InferRawDocType } from 'mongoose';

export type TObjectId = mongoose.Types.ObjectId;

export type TFilter<T> = FilterQuery<InferRawDocType<T>>;
