import { Types } from 'mongoose';

export const toObjectId = (id: string) => {
  return Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
};
