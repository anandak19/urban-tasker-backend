import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { CategoryDocument } from '../schemas/categories.schema';
import { ICreateCategory } from './category.interface';
import { SubCategoryDocument } from '../schemas/subcategories.schema';
import { ICreateSubCategory } from './subcategory.interface';
import {
  IFindAllQuery,
  PaginatedResult,
} from '@shared/interfaces/query.interface';
import { TObjectId } from '@shared/types/db-types';
import { IOptionData } from '@shared/interfaces/response-data.interface';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';

export interface ICategoryRepository
  extends IBaseRepository<CategoryDocument, ICreateCategory> {
  findByName(name: string): Promise<CategoryDocument | null>;

  changeIsActive(
    id: string,
    isActive: boolean,
  ): Promise<CategoryDocument | null>;

  findAllCategories(
    categoryQuery: GetDocsDto,
  ): Promise<PaginatedResult<CategoryDocument>>;

  getActiveCategoriesOptions(): Promise<IOptionData[]>;
}

export interface ISubCategoryRepository
  extends IBaseRepository<SubCategoryDocument, ICreateSubCategory> {
  findByName(name: string): Promise<SubCategoryDocument | null>;

  changeIsActive(
    id: string,
    isActive: boolean,
  ): Promise<SubCategoryDocument | null>;

  findAllSubCategories(
    parentCategoryId: string,
    pagination?: IFindAllQuery,
  ): Promise<PaginatedResult<SubCategoryDocument>>;

  /**
   * Gets all docs with given ids
   * @param ids
   */
  findActiveCategoriesById(
    ids: TObjectId[],
  ): Promise<SubCategoryDocument[] | null>;

  getActiveSubCategoriesOptions(categoryId: string): Promise<IOptionData[]>;
}
