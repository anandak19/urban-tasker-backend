import { type Express } from 'express';
import type { ICategory, ICreateCategory } from './category.interface';
import type { ICategoryResponse } from './responses.interface';

export interface ICategoryService {
  /**
   * Add new category
   * @param file
   * @param categoryData
   */
  create(
    file: Express.Multer.File,
    categoryData: ICreateCategory,
  ): Promise<ICategoryResponse>;

  getCategoryByName(categoryName: string): Promise<ICategory | null>;
}
