import { Types } from 'mongoose';

export interface ICreateSubCategory {
  name: string;
  description: string;
  imageUrl: string;
  categoryId: Types.ObjectId;
}
