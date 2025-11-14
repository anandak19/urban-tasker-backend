import { IBasicResponseData } from '@shared/interfaces/base-response.interface';
import { ICategory } from './category.interface';
import { PaginatedResult } from '@shared/interfaces/query.interface';

export type ICategoryResponse = IBasicResponseData<ICategory, 'category'>;

/**
 * Array of categories
 * property name is: categories
 * ex:
 * categories: [
 *  { /.../ }, { /.../ }, { /.../ }
 * ]
 */
export type IFindAllCategoryResponse = PaginatedResult<ICategory>;
