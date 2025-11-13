import { BaseRepository } from '@shared/repository/base.repository';
import { Category, CategoryDocument } from '../schemas/categories.schema';
import { ICreateCategory } from '../interfaces/category.interface';
import { ICategoryRepository } from '../interfaces/categories-repositories.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class CategoryRepository
  extends BaseRepository<CategoryDocument, ICreateCategory>
  implements ICategoryRepository
{
  constructor(
    @InjectModel(Category.name) private _categoryModel: Model<CategoryDocument>,
  ) {
    super(_categoryModel);
  }

  async findByName(name: string): Promise<CategoryDocument | null> {
    return await this.findOne({ name });
  }

  deleteCategory(id: string) {
    console.log('Category to delete', id);
    throw new Error('Method not implemented.');
  }
}
