import { BaseRepository } from '@shared/repository/base.repository';
import { CategoryDocument } from '../schemas/categories.schema';
import { ICreateCategory } from '../interfaces/category.interface';
import { ICategoryRepository } from '../interfaces/categories-repositories.interface';

export class CategoryRepository
  extends BaseRepository<CategoryDocument, ICreateCategory>
  implements ICategoryRepository
{
  deleteCategory(id: string) {
    console.log('Category to delete', id);
    throw new Error('Method not implemented.');
  }
}
