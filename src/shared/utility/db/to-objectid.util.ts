import { TObjectId } from '@shared/types/db-types';
import { Types } from 'mongoose';

export const toObjectId = (id: string | TObjectId) => {
  if (id instanceof Types.ObjectId) {
    return id;
  }

  return new Types.ObjectId(id);
};
