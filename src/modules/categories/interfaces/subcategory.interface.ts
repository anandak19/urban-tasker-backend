import { Types } from 'mongoose';

// for repo
export interface ICreateSubCategory {
  name: string;
  description: string;
  image?: string;
  categoryId: Types.ObjectId | string;
}

export interface ISubCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  slug: string;
}
