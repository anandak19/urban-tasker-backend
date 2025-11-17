import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { CategoryDocument } from '../schemas/categories.schema';
import { ICreateCategory } from './category.interface';
import { SubCategoryDocument } from '../schemas/subcategories.schema';
import { ICreateSubCategory } from './subcategory.interface';

export interface ICategoryRepository
  extends IBaseRepository<CategoryDocument, ICreateCategory> {
  findByName(name: string): Promise<CategoryDocument | null>;

  changeIsActive(
    id: string,
    isActive: boolean,
  ): Promise<CategoryDocument | null>;
}

export interface ISubCategoryRepository
  extends IBaseRepository<SubCategoryDocument, ICreateSubCategory> {
  findByName(name: string): Promise<SubCategoryDocument | null>;

  changeIsActive(
    id: string,
    isActive: boolean,
  ): Promise<CategoryDocument | null>;
}
