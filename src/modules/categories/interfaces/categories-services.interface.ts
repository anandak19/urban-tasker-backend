import { type Express } from 'express';
import type { ICategory, ICreateCategory } from './category.interface';
import type {
  ICategoryResponse,
  IFindAllCategoryResponse,
  ISubCategoryResponse,
} from './responses.interface';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { ICreateSubCategory } from './subcategory.interface';

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

/**
 * SUB-CATEGORIES
 */
export interface ISubCategoryService {
  // add category
  create(
    file: Express.Multer.File,
    categoryData: ICreateSubCategory,
  ): Promise<ISubCategoryResponse>;

  // chagne status
  // delete cateogry
  // get category by id
  // get all subcategories
}
