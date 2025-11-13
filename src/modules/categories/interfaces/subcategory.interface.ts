import { Types } from 'mongoose';

export interface ICreateSubCategory {
  name: string;
  description: string;
  image: string;
  categoryId: Types.ObjectId;
}
