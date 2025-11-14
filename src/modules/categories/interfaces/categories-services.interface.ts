import { type Express } from 'express';
import type { ICategory, ICreateCategory } from './category.interface';
import type {
  ICategoryResponse,
  IFindAllCategoryResponse,
} from './responses.interface';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';

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

  /**
   * Get category by name
   * @param categoryName
   * @returns {ICategory | null}
   */
  getCategoryByName(categoryName: string): Promise<ICategory | null>;

  findAllCategories(
    categoryQuery?: GetDocsDto,
  ): Promise<IFindAllCategoryResponse>;
}
