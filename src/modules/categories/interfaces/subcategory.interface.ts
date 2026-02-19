import { Types } from 'mongoose';
import { ICategoryCard } from './category.interface';

// for repo
export interface ICreateSubCategory {
  name: string;
  description: string;
  image?: string;
  categoryId: Types.ObjectId | string;
}

// have this in f
export interface ISubCategoryCard extends ICategoryCard {
  description: string;
}

export interface ISubCategory extends ISubCategoryCard {
  isActive: boolean;
  slug: string;
  isDeleted: boolean;
}
