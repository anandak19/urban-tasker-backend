import { IBaseRepository } from '@shared/interfaces/base-repository.interface';
import { CategoryDocument } from '../schemas/categories.schema';
import { ICreateCategory } from './category.interface';

export interface ICategoryRepository
  extends IBaseRepository<CategoryDocument, ICreateCategory> {
  deleteCategory(id: string);

  findByName(name: string): Promise<CategoryDocument | null>;

  changeIsActive(
    id: string,
    isActive: boolean,
  ): Promise<CategoryDocument | null>;
}
