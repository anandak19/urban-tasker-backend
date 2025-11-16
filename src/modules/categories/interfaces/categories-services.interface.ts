import { type Express } from 'express';
import type { ICategory, ICreateCategory } from './category.interface';
import type {
  ICategoryResponse,
  IFindAllCategoryResponse,
} from './responses.interface';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';

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

  /**
   * Find all categories (Excluding deleted ones)
   * Paginated and includes optional filters
   * @param categoryQuery
   */
  findAllCategories(
    categoryQuery?: GetDocsDto,
  ): Promise<IFindAllCategoryResponse>;

  /**
   * Find a category by id
   * @param id
   */
  findById(id: string): Promise<ICategory | null>;

  /**
   * Change is active status of category
   * @param id
   * @param isActive
   */
  changeIsActive(id: string, isActive: boolean): Promise<ICategory | null>;

  /**
   * Delete a category by id
   * @param id
   * @returns - success message
   */
  deleteById(id: string): Promise<IBaseResponse>;
}
