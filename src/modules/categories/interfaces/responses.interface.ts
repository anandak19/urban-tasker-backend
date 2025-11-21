import { IBasicResponseData } from '@shared/interfaces/base-response.interface';
import { ICategory } from './category.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';
import { ISubCategory } from './subcategory.interface';

export type ICategoryResponse = IBasicResponseData<ICategory, 'category'>;

export type ISubCategoryResponse = IBasicResponseData<
  ISubCategory,
  'subcategory'
>;

/**
 * Array of categories
 * property name is: categories
 * ex:
 * categories: [
 *  { /.../ }, { /.../ }, { /.../ }
 * ]
 */
export type IFindAllCategoryResponse = PaginatedResult<ICategory>;

export type IFindAllSubCategoryResponse = PaginatedResult<ISubCategory>;
